using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IBuildOperationsService
    {
        Task StartBuild(int projectId);
        Task CancelBuild(int projectId);
    }
}
