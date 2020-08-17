using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.BuildHistory;
using buildeR.Common.DTO.User;
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
            // return await _buildService.GetHistoryByProjectId(id);
            return new[]
            {
                new BuildHistoryDTO
                {
                    Duration = 600, BuildAt = DateTime.Now, CommitHash = "e74a56257b44dc0dbd95144aa65bd6c760d68662",
                    BuildStatus = 0, ProjectId = id, Performer = new UserDTO {Id = 28, Username = "Zhenia"}
                },
                new BuildHistoryDTO
                {
                    Duration = 123, BuildAt = DateTime.Now, CommitHash = "e74a56257b44dc0dbd95144aa65bd6c760d68662",
                    BuildStatus = 1, ProjectId = id, Performer = new UserDTO {Id = 28, Username = "Zhenia"}
                },
                new BuildHistoryDTO
                {
                    Duration = 12, BuildAt = DateTime.Now, CommitHash = "e74a56257b44dc0dbd95144aa65bd6c760d68662",
                    BuildStatus = 2, ProjectId = id, Performer = new UserDTO {Id = 28, Username = "Zhenia"}
                },
                new BuildHistoryDTO
                {
                    Duration = 1234, BuildAt = DateTime.Now, CommitHash = "e74a56257b44dc0dbd95144aa65bd6c760d68662",
                    BuildStatus = 3, ProjectId = id, Performer = new UserDTO {Id = 28, Username = "Zhenia"}
                }
            }.AsEnumerable();
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