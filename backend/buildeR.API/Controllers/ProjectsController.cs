using buildeR.BLL.RabbitMQ;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.Project;

using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly ProcessorProducer _producer;
        public ProjectsController(IProjectService projectService, ProcessorProducer producer)
        {
            _projectService = projectService;
            _producer = producer;
        }

        [HttpGet("getProjectsByUserId/{userId:int}")]
        public async Task<IEnumerable<ProjectInfoDTO>> GetProjectsByUserId(int userId)
        {
            return await _projectService.GetProjectsByUser(userId);
        }

        [HttpGet("{projectId}/settings")]
        public async Task<ProjectDTO> GetProjectById(int projectId)
        {
            int userId = 1; // here will be userId from token or somthing else
            return await _projectService.GetProjectByUserId(userId, projectId);
        }

        [HttpPost]
        public async Task<ActionResult<ProjectDTO>> CreateProject([FromBody] NewProjectDTO dto)
        {
            dto.OwnerId = 1; // here will be userId from token or somthing else
            return Ok(await _projectService.CreateProject(dto));
        }

        [HttpPut]
        public async Task<ActionResult<ProjectDTO>> UpdateProject([FromBody] ProjectDTO dto)
        {
            dto.OwnerId = 1; // here will be userId from token or somthing else
            await _projectService.UpdateAsync(dto);
            return Ok(await _projectService.GetAsync(dto.Id));
        }

        [HttpPost("{projectId}/build")]
        public async Task<IActionResult> BuildProject(int projectId)
        {
            var build = await _projectService.GetExecutiveBuild(projectId);
            _producer.Send(JsonConvert.SerializeObject(build), build.GetType().Name);
            return Ok();
        }
    }
}
