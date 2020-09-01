using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.ProjectGroup;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace buildeR.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProjectGroupController : ControllerBase
    {
        IProjectGroupService _projectGroupService;

        public ProjectGroupController(IProjectGroupService projectGroupService)
        {
            _projectGroupService = projectGroupService;
        }

        [HttpPost]
        public async Task<ProjectGroupDTO> Create(NewProjectGroupDTO project)
        {
            return await _projectGroupService.Create(project);
        }

        [HttpDelete("{groupId}/{projectId}")]
        public async Task Delete(int groupId, int projectId)
        {
            await _projectGroupService.Delete(groupId, projectId);
        }
    }
}
