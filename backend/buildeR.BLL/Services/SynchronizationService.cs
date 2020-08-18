using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.Synchronization;
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
        public async Task<IEnumerable<Repository>> GetUserRepositories(int userId, string providerToken)
        {
            var repos = await _githubClient.GetUserRepositories(userId, providerToken);
            return repos.Select(r => new Repository { Id = r.Id, Name = r.Name });
        }

        public async Task RegisterWebhook(int projectId, string callback, string accessToken)
        {
            var project = await _projectService.GetAsync(projectId);
            await _githubClient.CreateWebhook(project.Repository, callback, accessToken);
        }
    }
}
