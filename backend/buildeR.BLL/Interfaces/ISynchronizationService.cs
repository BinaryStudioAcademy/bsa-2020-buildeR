using buildeR.Common.DTO.Synchronization;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface ISynchronizationService
    {
        Task<IEnumerable<Branch>> GetRepositoryBranches(int projectId, string accessToken);
        Task<IEnumerable<Repository>> GetUserRepositories(string accessToken);
        Task<bool> CheckIfRepositoryAccessable(string repoUrl);
        Task RegisterWebhook(int projectId, string callback, string accessToken);
    }
}
