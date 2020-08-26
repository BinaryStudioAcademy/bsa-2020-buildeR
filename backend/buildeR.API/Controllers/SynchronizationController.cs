using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.Synchronization;
using buildeR.Common.DTO.Synchronization.Github;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace buildeR.API.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class SynchronizationController : ControllerBase
    {
        private readonly ISynchronizationService _synchronizationService;
        public SynchronizationController(ISynchronizationService synchronizationService)
        {
            _synchronizationService = synchronizationService;
        }

        [HttpGet("user/{userId}/credentials")]
        public async Task<Credentials> GetUserCredentials(int userId)
        {
            return await _synchronizationService.GetUserCredentials(userId);
        }

        [HttpPost("user/exist")]
        public async Task<bool> CheckIfUserExist([FromBody]Credentials credentials)
        {
            return await _synchronizationService.CheckIfUserExist(credentials);
        }

        [HttpGet("{userId}/repos")]
        public async Task<IEnumerable<Repository>> GetUserRepositories(int userId)
        {
            return await _synchronizationService.GetUserRepositories(userId);
        }

        [HttpGet("{projectId}/branches")]
        public async Task<IEnumerable<Branch>> GetRepositoryBranches(int projectId)
         {
            return await _synchronizationService.GetRepositoryBranches(projectId);
        }

        [HttpPost("{userId}/repo/exist")]
        public async Task<bool> CheckIfRepositoryAccessable(int userId, [FromBody]RepositoryLinkDTO linkDTO)
        {
            return await _synchronizationService.CheckIfRepositoryAccessable(linkDTO.Link, userId);
        }

        [HttpPost("hooks/{projectId}")]
        public async Task RegisterWebhooks(int projectId)
        {
            var callback = Url.RouteUrl("Webhooks", new { controller = $"webhooks" }, Request.Scheme);

            await _synchronizationService.RegisterWebhook(projectId, callback);
        }

        [HttpPost("credentials/{userId}")]
        public async Task SetUpCredentials(int userId, [FromBody]Credentials credentials)
        {
            await _synchronizationService.SetUpUserCredentials(userId, credentials);
        }
    }
}
