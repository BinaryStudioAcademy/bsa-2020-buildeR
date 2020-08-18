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

        [HttpGet("{id}")]
        public async Task<BuildHistoryDTO> GetById(int id)
        {
            return await _buildService.GetBuildById(id);
        }

        [HttpPost]
        public async Task<BuildHistoryDTO> Create(NewBuildHistoryDTO BuildStep)
        {
            return await _buildService.Create(BuildStep);
        }

        [HttpPut]
        public async Task Update(BuildHistoryDTO BuildStep)
        {
            await _buildService.Update(BuildStep);
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _buildService.Delete(id);
        }
    }
}