using buildeR.Common.DTO.Synchronization;
using buildeR.Common.DTO.Synchronization.Github;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IGithubClient
    {
        Task<GithubUser> GetUserFromToken(string token);
        Task<IEnumerable<GithubRepository>> GetUserRepositories(string token);
        Task<IEnumerable<GithubBranch>> GetPrivateRepositoryBranches(string repositoryName, string token);
        Task<IEnumerable<GithubBranch>> GetPublicRepositoryBranches(string repositoryName, string repositoryOwner);
        Task<bool> CheckIfRepositoryAccessable(string repoName, string repoOwner, string token = null);
        Task<AccessTokenCheckDTO> CheckIfTokenValid(string token);
        Task CreateWebhook(string repositoryName, string eventName, string callback, string token);
    }
}
