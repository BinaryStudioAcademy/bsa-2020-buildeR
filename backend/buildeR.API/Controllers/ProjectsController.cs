using buildeR.BLL.Interfaces;
using buildeR.BLL.RabbitMQ;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.EnvironmentVariables;
using buildeR.Common.DTO.Project;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly IBuildOperationsService _builder;
        private readonly IEnvironmentVariablesService _envService;
        public ProjectsController(IProjectService projectService,
                                  IBuildOperationsService builder,
                                  IEnvironmentVariablesService envService)
        {
            _builder = builder;
            _envService = envService;
            _projectService = projectService;
        }

        [HttpGet("getProjectsByUserId/{userId:int}")]
        public async Task<IEnumerable<ProjectInfoDTO>> GetProjectsByUserId(int userId)
        {
            return await _projectService.GetProjectsByUser(userId);
        }

        [HttpGet("{projectId}/settings")]
        public async Task<ProjectDTO> GetProjectById(int projectId)
        {
            return await _projectService.GetAsync(projectId);
        }

        [HttpPost]
        public async Task<ProjectDTO> CreateProject([FromBody] NewProjectDTO dto)
        {
            return await _projectService.CreateProject(dto);
        }

        [HttpPut]
        public async Task<ProjectDTO> UpdateProject([FromBody] ProjectDTO dto)
        {
            await _projectService.UpdateAsync(dto);
            return await _projectService.GetAsync(dto.Id);
        }

        [HttpDelete("{id}")]
        public async Task DeleteProject(int id)
        {
            await _projectService.DeleteProject(id);
        }
        [HttpPost("copy")]
        public async Task<ProjectDTO> CopyProject(ProjectDTO projectDTO)
        {
            return await _projectService.CopyProject(projectDTO);
        }

        [HttpPost("{projectId}/build")]
        public async Task<IActionResult> BuildProject(int projectId)
        {
            await _builder.StartBuild(projectId);
            return Ok();
        }

        [HttpPost("markFavorite/{projectId}")]
        public async Task ChangeFavoriteState(int projectId)
        {
            await _projectService.ChangeFavoriteStateAsync(projectId);
        }

        [HttpPost("envVar")]
        public async Task<Dictionary<string,string>> AddEnviromentVariable([FromBody] EnvironmentVariableDTO variableDTO)
        {
            var secrets = await _envService.AddEnvironmenVariable(variableDTO);
            return secrets;
        }

    }
}
