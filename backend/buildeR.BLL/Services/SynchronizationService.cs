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
            var credentials = await GetUserCredentials(project.OwnerId);
            
            IEnumerable<GithubBranch> branches = null;

            if (repository.Private)
                branches = await _githubClient.GetPrivateRepositoryBranches(repository.Name, credentials.Username, credentials.Password);
            else
                branches = await _githubClient.GetPublicRepositoryBranches(repository.Name, repository.Owner);

            return branches.Select(b => new Branch { Name = b.Name });
        }
        public async Task<IEnumerable<Repository>> GetUserRepositories(int userId)
        {
            var credentials = await GetUserCredentials(userId);

            var repositories = await _githubClient.GetUserRepositories(credentials.Username, credentials.Password);

            return repositories.Select(r => new Repository { Name = r.Name, Owner = r.Owner.Login, Private = r.Private, Description = r.Description });
        }
        public async Task<bool> CheckIfRepositoryAccessable(string repoUrl, int userId)
        {
            var credentials = await GetUserCredentials(userId);

            var repoName = _synchronizationHelper.GetRepositoryNameFromUrl(repoUrl);
            var repoOwner = _synchronizationHelper.GetRepositoryOwnerFromUrl(repoUrl);

            return await _githubClient.CheckIfRepositoryAccessable(repoName, repoOwner, credentials.Username, credentials.Password);
        }
        public async Task<bool> CheckIfUserExist(Credentials credentials)
        {
            return await _githubClient.CheckIfUserExist(credentials.Username, credentials.Password);
        }
        public async Task<bool> CheckIfUserHasCredentials(int userId)
        {
            try
            {
                var credentials = await GetUserCredentials(userId);

                if (string.IsNullOrEmpty(credentials.Username) || string.IsNullOrEmpty(credentials.Password))
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
            callback += $"/{projectId}/github";

            var project = await _projectService.GetAsync(projectId);
            var repository = await _projectService.GetRepository(projectId);
            var credentials = await GetUserCredentials(project.OwnerId);

            await _githubClient.CreateWebhook(repository.Name, callback, credentials.Username, credentials.Password);
        }
        public async Task SetUpUserCredentials(int userId, Credentials credentials)
        {
            var credentialsDictionary = new Dictionary<string, string>();

            credentialsDictionary.Add("username", credentials.Username);
            credentialsDictionary.Add("password", credentials.Password);

            await _secretService.CreateSecretsAsync(credentialsDictionary, $"users/{userId}/credentials/github");
        }
        public async Task<Credentials> GetUserCredentials(int userId)
        {
            try
            {
                var dictionary = await _secretService.ReadSecretsAsync($"users/{userId}/credentials/github");

                dictionary.TryGetValue("username", out string username);
                dictionary.TryGetValue("password", out string password);

                return new Credentials { Username = username, Password = password };
            }
            catch(Exception)
            {
                return new Credentials();
            }
        }
    }
}
