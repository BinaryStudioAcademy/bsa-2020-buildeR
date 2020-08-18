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

        [HttpGet("repos/{userId:int}")]
        public async Task<IEnumerable<Repository>> GetUserRepositories(int userId, [FromHeader]string ProviderAuthorization)
        {
            return await _synchronizationService.GetUserRepositories(userId, ProviderAuthorization);
        }

        [HttpPost("hooks/{projectId}")]
        public async Task RegisterWebhooks(int projectId, [FromHeader] string ProviderAuthorization)
        {
            var callback = Url.RouteUrl("webhooks", new { projectId = projectId });
            await _synchronizationService.RegisterWebhook(projectId, callback, ProviderAuthorization);
        }
    }
}
