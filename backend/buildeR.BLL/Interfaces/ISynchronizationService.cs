using buildeR.Common.DTO.Synchronization;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface ISynchronizationService
    {
        Task<IEnumerable<Repository>> GetUserRepositories(int userId, string accessToken);
    }
}
