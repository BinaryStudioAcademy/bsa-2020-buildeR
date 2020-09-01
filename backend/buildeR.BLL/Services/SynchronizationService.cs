using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.Synchronization;
using buildeR.Common.DTO.Synchronization.Github;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class SynchronizationService : ISynchronizationService
    {
        private readonly IGithubClient _githubClient;
        private readonly IProjectService _projectService;
        private readonly ISynchronizationHelper _synchronizationHelper;
        private readonly ISecretService _secretService;
        public SynchronizationService(IGithubClient githubClient,
                                      IProjectService projectService,
                                      ISynchronizationHelper synchronizationHelper,
                                      ISecretService secretService)
        {
            _githubClient = githubClient;
            _projectService = projectService;
            _synchronizationHelper = synchronizationHelper;
            _secretService = secretService;
        }
        public async Task<IEnumerable<Branch>> GetRepositoryBranches(int projectId)
        {
            var project = await _projectService.GetAsync(projectId);
            var repository = await _projectService.GetRepository(projectId);
            var token = await GetUserAccessToken(project.OwnerId);
            
            IEnumerable<GithubBranch> branches = null;

            if (repository.Private)
                branches = await _githubClient.GetPrivateRepositoryBranches(repository.Name, token.Token);
            else
                branches = await _githubClient.GetPublicRepositoryBranches(repository.Name, repository.Owner);

            return branches.Select(b => new Branch { Name = b.Name });
        }
        public async Task<IEnumerable<Repository>> GetUserRepositories(int userId)
        {
            var token = await GetUserAccessToken(userId);

            var repositories = await _githubClient.GetUserRepositories(token.Token);

            return repositories.Select(r => new Repository { Name = r.Name, Owner = r.Owner.Login, Private = r.Private, Description = r.Description, Url = r.Html_Url });
        }
        public async Task<bool> CheckIfRepositoryAccessable(string repoUrl, int userId)
        {
            var repoName = _synchronizationHelper.GetRepositoryNameFromUrl(repoUrl);
            var repoOwner = _synchronizationHelper.GetRepositoryOwnerFromUrl(repoUrl);

            return await _githubClient.CheckIfRepositoryAccessable(repoName, repoOwner);
        }
        public async Task<AccessTokenCheckDTO> CheckIfTokenValid(string token)
        {
            return await _githubClient.CheckIfTokenValid(token);
        }
        public async Task<bool> CheckIfUserHasToken(int userId)
        {
            try
            {
                var token = await GetUserAccessToken(userId);

                if (string.IsNullOrEmpty(token.Token))
                    return false;

                return true;
            }
            catch(Exception)
            {
                return false;
            }
        }
        public async Task RegisterWebhook(int projectId, string callback)
        {
            callback = $"http://5451f9723672.ngrok.io/webhooks/{projectId}/github";

            var pushCallback = callback + "/push";
            var pullRequestCallback = callback + "/pull_request";

            var project = await _projectService.GetAsync(projectId);
            var repository = await _projectService.GetRepository(projectId);
            var token = await GetUserAccessToken(project.OwnerId);

            await _githubClient.CreateWebhook(repository.Name, "push", pushCallback, token.Token);
            await _githubClient.CreateWebhook(repository.Name, "pull_request", pullRequestCallback, token.Token);
        }
        public async Task SetUpUserToken(int userId, string token)
        {
            var credentialsDictionary = new Dictionary<string, string>();

            credentialsDictionary.Add("token", token);

            await _secretService.CreateSecretsAsync(credentialsDictionary, $"users/{userId}/token/github");
        }
        public async Task<AccessTokenDTO> GetUserAccessToken(int userId)
        {
            try
            {
                var dictionary = await _secretService.ReadSecretsAsync($"users/{userId}/token/github");

                dictionary.TryGetValue("token", out string token);

                return new AccessTokenDTO { Token = token};
            }
            catch(Exception)
            {
                return new AccessTokenDTO { Token = "" };
            }
        }
    }
}
