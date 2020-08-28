using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.BuildHistory;
using buildeR.Common.DTO.User;
using buildeR.Common.Enums;
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

        [HttpGet("{id}")]
        public async Task<BuildHistoryDTO> GetById(int id)
        {
            return await _buildService.GetBuildById(id);
        }

        [HttpPost("{id}/status/{status:int}")]
        public async Task<BuildHistoryDTO> ChangeStatus(int id, int status)
        {
            return await _buildService.ChangeStatus(id, status);
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