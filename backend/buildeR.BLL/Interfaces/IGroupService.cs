using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.Group;
using buildeR.Common.DTO.Project;
using buildeR.Common.DTO.TeamMember;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IGroupService : ICrudService<GroupDTO, NewGroupDTO, int>
    {
        Task<IEnumerable<GroupDTO>> GetGroupsWithMembersAndProjects();
        Task<GroupDTO> GetGroupById(int id);
        Task<IEnumerable<GroupDTO>> GetAll();
        Task<GroupDTO> Create(NewGroupDTO group);
        Task Update(GroupDTO group);
        Task Delete(int id);
        Task<IEnumerable<ProjectInfoDTO>> GetGroupProjects(int id);
        Task<IEnumerable<TeamMemberDTO>> GetGroupMembers(int id);
        Task<IEnumerable<GroupDTO>> GetGroupsByUserId(int userId);
    }
}
