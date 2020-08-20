using System.Collections.Generic;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.BuildStep;
using Microsoft.AspNetCore.Mvc;

namespace buildeR.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BuildStepsController : ControllerBase
    {
        private readonly IBuildStepService _buildStepService;
        public BuildStepsController(IBuildStepService buildStepService)
        {
            _buildStepService = buildStepService;
        }

        [HttpGet]
        public async Task<IEnumerable<BuildStepDTO>> GetAll()
        {
            return await _buildStepService.GetAll();
        }

        [HttpGet("{id}")]
        public async Task<BuildStepDTO> GetById(int id)
        {
            return await _buildStepService.GetBuildStepById(id);
        }

        [HttpPost]
        public async Task<BuildStepDTO> Create(NewBuildStepDTO buildStep)
        {
            return await _buildStepService.Create(buildStep);
        }

        [HttpPut]
        public async Task Update(BuildStepDTO buildStep)
        {
            await _buildStepService.Update(buildStep);
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _buildStepService.Delete(id);
        }

        [HttpGet("getEmptyBuildSteps")]
        public async Task<IEnumerable<EmptyBuildStepDTO>> GetEmptyBuildSteps()
        {
            return await _buildStepService.GetEmptyBuildSteps();
        }

        [HttpGet("project/{projectId:int}")]
        public async Task<IEnumerable<BuildStepDTO>> GetBuildStepsByProject(int projectId)
        {
            return await _buildStepService.GetBuildStepsByProjectId(projectId);
        }
    }
}