using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.BuildHistory;
using System.Collections.Generic;
using System.Threading.Tasks;
using buildeR.Common.DTO;

namespace buildeR.BLL.Interfaces
{
    public interface IBuildService : ICrudService<BuildHistoryDTO, NewBuildHistoryDTO, int>
    {
        Task<BuildHistoryDTO> GetBuildById(int id);
        Task<IEnumerable<BuildHistoryDTO>> GetAll();
        Task<BuildHistoryDTO> Create(NewBuildHistoryDTO build);
        Task Update(BuildHistoryDTO build);
        Task Delete(int id);
        Task<IEnumerable<BuildHistoryDTO>> GetHistoryByProjectId(int id);
        Task<IEnumerable<BuildHistoryDTO>> GetMonthHistoryByUserId(int id);
        Task<BuildHistoryDTO> ChangeStatus(StatusChangeDto statusChange);
    }
}
