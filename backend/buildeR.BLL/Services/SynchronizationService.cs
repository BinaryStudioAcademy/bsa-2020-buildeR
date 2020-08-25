using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.Synchronization;
using buildeR.Common.DTO.Synchronization.Github;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class SynchronizationService : ISynchronizationService
    {
        private readonly IGithubClient _githubClient;

        private readonly IProjectService _projectService;

        public SynchronizationService(IGithubClient githubClient, IProjectService projectService)
        {
            _githubClient = githubClient;
            _projectService = projectService;
        }

        public async Task<IEnumerable<Branch>> GetRepositoryBranches(int projectId, string accessToken)
        {
            var repository = await _projectService.GetRepository(projectId);
           IEnumerable<GithubBranch> branches = null;

            if (repository.Owner != null)
                branches = await _githubClient.GetRepositoryBranches(repository.Owner, repository.Name, accessToken);
            else
                branches = await _githubClient.GetRepositoryBranches(repository.Name, accessToken);
            
            return branches.Select(b => new Branch { Name = b.Name });
        }

        public async Task<IEnumerable<Repository>> GetUserRepositories(string accessToken)
        {
            var repos = await _githubClient.GetUserRepositories(accessToken);
            return repos.Select(r => new Repository { Id = r.Id, Name = r.Name, Private = r.Private });
        }

        public async Task RegisterWebhook(int projectId, string callback, string accessToken)
        {
            callback += $"/{projectId}/github";

            var project = await _projectService.GetAsync(projectId);
            await _githubClient.CreateWebhook(project.Repository, callback, accessToken);
        }
    }
}
