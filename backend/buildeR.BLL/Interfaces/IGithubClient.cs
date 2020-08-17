using buildeR.Common.DTO.Synchronization.Github;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IGithubClient
    {
        Task<GithubUser> GetUserFromToken(int userId);
        Task<IEnumerable<GithubRepository>> GetUserRepositories(int userId);
        Task<IEnumerable<GithubBranch>> GetRepositoryBranches(int userId, string repositoryName);
    }
}
