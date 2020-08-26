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
            var credentials = await _secretService.ReadSecretsAsync($"users/{project.OwnerId}/credentials/github");
            
            IEnumerable<GithubBranch> branches = null;

            if (repository.Private)
                branches = await _githubClient.GetPrivateRepositoryBranches(repository.Name, credentials["username"], credentials["password"]);
            else
                branches = await _githubClient.GetPublicRepositoryBranches(repository.Name, repository.Owner);

            return branches.Select(b => new Branch { Name = b.Name });
        }
        public async Task<IEnumerable<Repository>> GetUserRepositories(int userId)
        {
            var credentials = await _secretService.ReadSecretsAsync($"users/{userId}/credentials/github");

            var repositories = await _githubClient.GetUserRepositories(credentials["username"], credentials["password"]);

            return repositories.Select(r => new Repository { Name = r.Name, Owner = r.Owner.Login, Private = r.Private });
        }
        public async Task<bool> CheckIfRepositoryAccessable(string repoUrl, int userId)
        {
            var credentials = await _secretService.ReadSecretsAsync($"users/{userId}/credentials/github");

            var repoName = _synchronizationHelper.GetRepositoryNameFromUrl(repoUrl);
            var repoOwner = _synchronizationHelper.GetRepositoryOwnerFromUrl(repoUrl);

            return await _githubClient.CheckIfRepositoryAccessable(repoName, repoOwner, credentials["username"], credentials["password"]);
        }
        public async Task RegisterWebhook(int projectId, string callback)
        {
            callback += $"/{projectId}/github";

            var project = await _projectService.GetAsync(projectId);
            var repository = await _projectService.GetRepository(projectId);
            var credentials = await _secretService.ReadSecretsAsync($"users/{project.OwnerId}/credentials/github");

            await _githubClient.CreateWebhook(repository.Name, callback, credentials["username"], credentials["password"]);
        }
    }
}
