using buildeR.DAL.Entities;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IBuildOperationsService
    {
        Task StartBuild(int projectId, int buildHistoryId, string branchName);
        Task CancelBuild(int projectId);
        Task<BuildHistory> PrepareBuild(int projectId, string buildAuthorUsername);
    }
}
