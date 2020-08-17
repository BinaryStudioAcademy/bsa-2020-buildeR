using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.Synchronization;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class SynchronizationService : ISynchronizationService
    {
        private readonly IGithubClient _githubClient;
        public SynchronizationService(IGithubClient githubClient)
        {
            _githubClient = githubClient;
        }
        public async Task<IEnumerable<Repository>> GetUserRepositories(int userId, string providerToken)
        {
            var repos = await _githubClient.GetUserRepositories(userId, providerToken);
            return repos.Select(r => new Repository { Id = r.Id, Name = r.Name });
        }
    }
}
