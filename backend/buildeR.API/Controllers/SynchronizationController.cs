using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.Synchronization;
using buildeR.Common.DTO.Synchronization.Github;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace buildeR.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SynchronizationController : ControllerBase
    {
        private readonly IGithubClient _githubClient;

        public SynchronizationController(IGithubClient githubClient)
        {
            _githubClient = githubClient;
        }

        [HttpGet("repos/{userId:int}")]
        public async Task<IEnumerable<Repository>> GetUserRepositories(int userId)
        {
            var repos = await _githubClient.GetUserRepositories(userId);
            return repos.Select(r => new Repository { Id = r.Id, Name = r.Name });
        }
    }
}
