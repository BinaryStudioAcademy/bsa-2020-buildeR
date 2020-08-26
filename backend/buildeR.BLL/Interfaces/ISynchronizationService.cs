using buildeR.Common.DTO.Synchronization;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface ISynchronizationService
    {
        Task<IEnumerable<Branch>> GetRepositoryBranches(int projectId);
        Task<IEnumerable<Repository>> GetUserRepositories(string username, string password);
        Task<bool> CheckIfRepositoryAccessable(string repoUrl, string username = null, string password = null);
        Task RegisterWebhook(int projectId, string callback);
    }
}
