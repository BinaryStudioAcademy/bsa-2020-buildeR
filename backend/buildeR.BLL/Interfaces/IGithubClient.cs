using buildeR.Common.DTO.Synchronization.Github;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IGithubClient
    {
        Task<GithubUser> GetUserFromCredentials(string username, string password);
        Task<IEnumerable<GithubRepository>> GetUserRepositories(string username, string password);
        Task<IEnumerable<GithubBranch>> GetPrivateRepositoryBranches(string repositoryName, string username, string password);
        Task<IEnumerable<GithubBranch>> GetPublicRepositoryBranches(string repositoryName, string repositoryOwner);
        Task<bool> CheckIfRepositoryAccessable(string repoName, string repoOwner, string username = null, string password = null);
        Task<bool> CheckIfUserExist(string username, string password);
        Task CreateWebhook(string repositoryName, string callback, string username, string password);
    }
}
