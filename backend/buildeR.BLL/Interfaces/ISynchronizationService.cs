using buildeR.Common.DTO.Synchronization;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface ISynchronizationService
    {
        Task<IEnumerable<Branch>> GetRepositoryBranches(int projectId);
        Task<IEnumerable<Repository>> GetUserRepositories(int userId);
        Task<bool> CheckIfRepositoryAccessable(string repoUrl, int userId);
        Task<bool> CheckIfUserExist(Credentials credentials);
        Task<bool> CheckIfUserHasCredentials(int userId);
        Task RegisterWebhook(int projectId, string callback);
        Task SetUpUserCredentials(int userId, Credentials credentials);
        Task<Credentials> GetUserCredentials(int userId);
    }
}
