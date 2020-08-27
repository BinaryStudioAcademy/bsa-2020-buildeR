using System.Collections.Generic;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.Group;
using buildeR.Common.DTO.Project;
using Microsoft.AspNetCore.Mvc;

namespace buildeR.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private readonly IGroupService _groupService;
        public GroupsController(IGroupService groupService)
        {
            _groupService = groupService;
        }

        [HttpGet]
        public async Task<IEnumerable<GroupDTO>> GetAll()
        {
           return await _groupService.GetGroupsWithMembersAndProjects();
        }

        [HttpGet("{id}")]
        public async Task<GroupDTO> GetById(int id)
        {
            return await _groupService.GetGroupById(id);
        }

        [HttpPost]
        public async Task<GroupDTO> Create(NewGroupDTO group)
        {
            return await _groupService.Create(group);
        }

        [HttpPut]
        public async Task Update(GroupDTO group)
        {
            await _groupService.Update(group);
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _groupService.Delete(id);
        }
        [HttpGet("getProjectsByGroupId/{groupId:int}")]
        public async Task<IEnumerable<ProjectInfoDTO>> GetProjectsByGroup(int groupId)
        {
            return await _groupService.GetGroupProjects(groupId);
        }
    }
}