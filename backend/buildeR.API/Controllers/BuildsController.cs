using System.Collections.Generic;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.BuildHistory;
using Microsoft.AspNetCore.Mvc;

namespace buildeR.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BuildsController : ControllerBase
    {
        private readonly IBuildService _buildService;

        public BuildsController(IBuildService buildService)
        {
            _buildService = buildService;
        }

        [HttpGet]
        public async Task<IEnumerable<BuildHistoryDTO>> GetAll()
        {
            return await _buildService.GetAll();
        }
        
        [HttpGet("project/{id}")]
        public async Task<IEnumerable<BuildHistoryDTO>> GetHistoryByProjectId(int id)
        {
            return await _buildService.GetHistoryByProjectId(id);
        }

        [HttpGet("project/{id}/last")]
        public async Task<BuildHistoryDTO> GetLastHistoryByProjectId(int id)
        {
            return await _buildService.GetLastHistoryByProjectId(id);
        }

        [HttpGet("user/{id}")]
        public async Task<IEnumerable<BuildHistoryDTO>> GetMonthHistoryByUserId(int id)
        {
            return await _buildService.GetMonthHistoryByUserId(id);
        }
        
        [HttpGet("user/startDate/{id}")]
        public async Task<IEnumerable<BuildHistoryDTO>> GetSortedByStartDateHistoryByUserId(int id)
        {
            return await _buildService.GetSortedByStartDateHistoryByUserId(id);
        }

        [HttpGet("{id}")]
        public async Task<BuildHistoryDTO> GetById(int id)
        {
            return await _buildService.GetBuildById(id);
        }

        [HttpPost]
        public async Task<BuildHistoryDTO> Create(NewBuildHistoryDTO buildHistory)
        {
            return await _buildService.Create(buildHistory);
        }

        [HttpPut]
        public async Task Update(BuildHistoryDTO buildHistory)
        {
            await _buildService.Update(buildHistory);
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _buildService.Delete(id);
        }
    }
}