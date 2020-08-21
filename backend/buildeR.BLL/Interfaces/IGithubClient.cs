using buildeR.Common.DTO.Synchronization.Github;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IGithubClient
    {
        Task<GithubUser> GetUserFromToken(string providerToken);
        Task<IEnumerable<GithubRepository>> GetUserRepositories(string providerToken);
        Task<IEnumerable<GithubBranch>> GetRepositoryBranches(string repositoryName, string providerToken);
        Task CreateWebhook(string repositoryName, string callback, string providerToken);
    }
}
