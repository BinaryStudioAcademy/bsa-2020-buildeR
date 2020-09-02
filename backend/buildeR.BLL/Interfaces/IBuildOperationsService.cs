using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IBuildOperationsService
    {
        Task StartBuild(int projectId, int buildHistoryId, string branchName, int userId);
        Task CancelBuild(int projectId);
    }
}
