using buildeR.Common.DTO.Synchronization.Github;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IGithubClient
    {
        Task<GithubUser> GetUserFromCredentials(string username, string password);
        Task<IEnumerable<GithubRepository>> GetUserRepositories(string username, string password);
        Task<IEnumerable<GithubBranch>> GetRepositoryBranches(string repositoryName, string username, string password);
        Task<bool> CheckIfRepositoryAccessable(string repoOwner, string repoName, string username = null, string password = null);
        Task CreateWebhook(string repositoryName, string callback, string username, string password);
    }
}
