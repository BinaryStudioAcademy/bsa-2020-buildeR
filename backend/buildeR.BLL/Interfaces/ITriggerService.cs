using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.ProjectTrigger;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface ITriggerService : ICrudService<ProjectTriggerDTO, NewProjectTriggerDTO, int>
    {
        Task<IEnumerable<ProjectTriggerInfoDTO>> GetAllByProjectId(int projectId);
        Task<ProjectTriggerInfoDTO> GetTriggerInfoById(int id);
        Task<ProjectTriggerInfoDTO> CreateTrigger(NewProjectTriggerDTO trigger);
        Task<ProjectTriggerInfoDTO> UpdateTrigger(ProjectTriggerDTO trigger);
        Task DeleteTrigger(int id);
    }
}
