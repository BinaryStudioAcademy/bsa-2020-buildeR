using buildeR.Common.DTO.BuildHistory;
using buildeR.Common.DTO.Project;
using buildeR.Common.DTO.ProjectRemoteTrigger;
using buildeR.Common.DTO.Repository;
using System.Collections.Generic;
using System.Threading.Tasks;
using buildeR.Common.DTO.TeamMember;
using buildeR.Common.DTO.User;

namespace buildeR.BLL.Services.Abstract
{
    public interface IProjectService : ICrudService<ProjectDTO, NewProjectDTO, int>
    {
        Task<IEnumerable<ProjectInfoDTO>> GetProjectsByUser(int userId);
        Task<IEnumerable<UsersGroupProjectsDTO>> NotOwnGroupsProjectsByUser(int userId);
        Task<ProjectDTO> GetProjectByUserId(int userId, int projectId);
        Task<ProjectDTO> CreateProject(NewProjectDTO dto);
        Task UpdateProject(ProjectDTO dto, int userId);
        Task<bool> CanUserRunNotOwnProject(int projectId, int userId);

        Task DeleteProject(int id);
        Task DeleteBuildStepsByProjectId(int projectId);
        Task<ExecutiveBuildDTO> GetExecutiveBuild(int projectId);
        Task ChangeFavoriteStateAsync(int projectId);

        Task<ProjectDTO> CopyProject(ProjectDTO dto);
        Task<RepositoryDTO> GetRepository(int projectId);
        Task<IEnumerable<ProjectRemoteTriggerDTO>> GetProjectRemoteTriggers(int projectId);

        Task<bool> CheckIfProjectNameIsUnique(int userId, string projectName, int projectId);
        Task<ICollection<BuildHistoryDTO>> GetAllBuildHistory(int projectId);
        Task<UserDTO> GetUserByProjectId(int projectId);
    }
}
