using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.Project;

using Microsoft.AspNetCore.Mvc;

using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet("{userId:int}")]
        public async Task<IEnumerable<ProjectInfoDTO>> GetProjectsByUserId(int userId)
        {
            return await _projectService.GetProjectsByUser(userId);
        }
        [HttpGet("{projectId}/settings")]
        public async Task<ProjectDTO> GetProjectById(int projectId)
        {
            int userId = 1;
            return await _projectService.GetProjectByUserId(userId, projectId);
        }
        [HttpPost]
        public async Task<ActionResult<ProjectDTO>> CreateProject([FromBody] NewProjectDTO dto)
        {
            dto.OwnerId = 1;
            return Ok(await _projectService.CreateProject(dto));
        }
        [HttpPut]
        public async Task<ActionResult<ProjectDTO>> UpdateProject([FromBody] ProjectDTO dto)
        {
            dto.OwnerId = 1;
            await _projectService.UpdateAsync(dto);
            return Ok(await _projectService.GetAsync(dto.Id));
        }
    }
}
