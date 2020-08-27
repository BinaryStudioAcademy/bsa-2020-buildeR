using buildeR.BLL.Interfaces;
using buildeR.BLL.RabbitMQ;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.EnvironmentVariables;
using buildeR.Common.DTO.Project;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using buildeR.Common.DTO.BuildHistory;
using buildeR.Common.DTO.Synchronization;

namespace buildeR.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly IBuildOperationsService _builder;
        private readonly IBuildService _buildService;
        private readonly IEnvironmentVariablesService _envService;
        public ProjectsController(IProjectService projectService,
                                  IBuildOperationsService builder,
                                  IEnvironmentVariablesService envService,
                                  IBuildService buildService)
        {
            _builder = builder;
            _envService = envService;
            _projectService = projectService;
            _buildService = buildService;
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

        [HttpPost("build")]
        public async Task<BuildHistoryDTO> BuildProject([FromBody] NewBuildHistoryDTO history)
        {
            var buildHistory = await _buildService.Create(history);
            await _builder.StartBuild(history.ProjectId, buildHistory.Id);
            return buildHistory;
        }

        [HttpPost("markFavorite/{projectId}")]
        public async Task ChangeFavoriteState(int projectId)
        {
            await _projectService.ChangeFavoriteStateAsync(projectId);
        }

        [HttpPost("envVar")]
        public async Task AddEnviromentVariable([FromBody] EnvironmentVariableDTO variableDTO)
        {
            await _envService.AddEnvironmenVariable(variableDTO);
        }

        [HttpGet("envVar/{projectId}")]
        public async Task<List<EnvironmentVariableDTO>> GetEnvironmentVariables(int projectId)
        {
            return await _envService.GetEnvironmentVariables(projectId.ToString());
        }

        [HttpPost("envVar/delete")]
        public async Task DeleteEnvironmentVariable([FromBody] EnvironmentVariableDTO variableDTO)
        {
             await _envService.DeleteEnvironmentVariable(variableDTO);
        }

        [HttpPut("envVar")]
        public async Task UpdateEnviromentVariable([FromBody] EnvironmentVariableDTO variableDTO)
        {
            await _envService.UpdateEnvironmentVariable(variableDTO);
        }
    }
}
