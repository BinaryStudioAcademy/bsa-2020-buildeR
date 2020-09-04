using buildeR.Common.DTO.Synchronization;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface ISynchronizationService
    {
        Task<IEnumerable<Branch>> GetRepositoryBranches(int projectId);
        Task<IEnumerable<Repository>> GetUserRepositories(int userId);
        Task<AccessTokenDTO> GetUserAccessToken(int userId);
        Task<Commit> GetLastProjectCommit(int projectId, string branch);
        Task<bool> CheckIfRepositoryAccessable(string repoUrl, int userId);
        Task<AccessTokenCheckDTO> CheckIfTokenValid(string token);
        Task<bool> CheckIfUserHasToken(int userId);
        Task RegisterWebhook(int projectId, string callback);
        Task SetUpUserToken(int userId, string token);
    }
}
