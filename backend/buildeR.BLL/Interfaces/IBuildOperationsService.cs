using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IBuildOperationsService
    {
        Task StartBuild(int projectId, int buildHistoryId = 0, int userId = 0);
        Task CancelBuild(int projectId);
    }
}
