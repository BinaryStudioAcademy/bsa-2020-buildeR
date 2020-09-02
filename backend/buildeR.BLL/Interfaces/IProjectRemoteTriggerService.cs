using buildeR.Common.DTO.ProjectRemoteTrigger;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IProjectRemoteTriggerService
    {
        Task<IEnumerable<ProjectRemoteTriggerDTO>> GetProjectTriggers(int projectId);
        Task<ProjectRemoteTriggerDTO> CreateProejectTrigger(NewProjectRemoteTriggerDTO trigger);
        Task<ProjectRemoteTriggerDTO> UpdateProjectTrigger(ProjectRemoteTriggerDTO trigger);
        Task DeleteProjectTrigger(int triggerId);
    }
}
