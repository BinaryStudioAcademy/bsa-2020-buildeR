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
        
        private static BuildHistoryDTO[] _testHistory(int projectId) => new[]
            {
                new BuildHistoryDTO
                {
                    Id = 1, Number = 1, Duration = 600000, BuildAt = DateTime.Now,
                    CommitHash = "e74a56257b44dc0dbd95144aa65bd6c760d68662",
                    BuildStatus = 0, ProjectId = projectId, Performer = new UserDTO {Id = 28, Username = "Zhenia"}
                },
                new BuildHistoryDTO
                {
                    Id = 2, Number = 2, Duration = 123000, BuildAt = DateTime.Now - TimeSpan.FromDays(5),
                    CommitHash = "e74a56257b44dc0dbd95144aa65bd6c760d68662",
                    BuildStatus = 1, ProjectId = projectId, Performer = new UserDTO {Id = 28, Username = "Zhenia"}
                },
                new BuildHistoryDTO
                {
                    Id = 3, Number = 3, Duration = 12000, BuildAt = DateTime.Now - TimeSpan.FromDays(10),
                    CommitHash = "e74a56257b44dc0dbd95144aa65bd6c760d68662",
                    BuildStatus = 2, ProjectId = projectId, Performer = new UserDTO {Id = 28, Username = "Zhenia"}
                },
                new BuildHistoryDTO
                {
                    Id = 4, Number = 4, Duration = 1000, BuildAt = DateTime.Now - TimeSpan.FromMinutes(45),
                    CommitHash = "e74a56257b44dc0dbd95144aa65bd6c760d68662",
                    BuildStatus = 3, ProjectId = projectId, Performer = new UserDTO {Id = 28, Username = "Zhenia"}
                },
                new BuildHistoryDTO
                {
                    Id = 5, Number = 5, Duration = 1, BuildAt = DateTime.Now - TimeSpan.FromMinutes(45),
                    CommitHash = "e74a56257b44dc0dbd95144aa65bd6c760d68662",
                    BuildStatus = 4, ProjectId = projectId, Performer = new UserDTO {Id = 28, Username = "Zhenia"}
                },
                new BuildHistoryDTO
                {
                    Id = 6, Number = 6, Duration = 123, BuildAt = DateTime.Now - TimeSpan.FromDays(365),
                    CommitHash = "e74a56257b44dc0dbd95144aa65bd6c760d68662",
                    BuildStatus = 5, ProjectId = projectId, Performer = new UserDTO {Id = 28, Username = "Zhenia"}
                }
            };

        [HttpGet("project/{id}")]
        public async Task<IEnumerable<BuildHistoryDTO>> GetHistoryByProjectId(int id)
        {
            // return await _buildService.GetHistoryByProjectId(id);
            return _testHistory(id).AsEnumerable();
        }

        [HttpGet("{id}")]
        public async Task<BuildHistoryDTO> GetById(int id)
        {
            // return await _buildService.GetBuildById(id);
            return _testHistory(1)[id-1];
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