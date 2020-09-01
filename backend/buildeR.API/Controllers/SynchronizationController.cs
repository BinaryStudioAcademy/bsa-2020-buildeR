using System.Collections.Generic;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.Synchronization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace buildeR.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SynchronizationController : ControllerBase
    {
        private readonly ISynchronizationService _synchronizationService;
        public SynchronizationController(ISynchronizationService synchronizationService)
        {
            _synchronizationService = synchronizationService;
        }

        [HttpPost("token/valid")]
        public async Task<AccessTokenCheckDTO> CheckIfTokenValid([FromBody]AccessTokenDTO token)
        {
            return await _synchronizationService.CheckIfTokenValid(token.Token);
        }

        [HttpGet("{userId}/token")]
        public async Task<AccessTokenDTO> GetUserAccessToken(int userId)
        {
            return await _synchronizationService.GetUserAccessToken(userId);
        }

        [HttpGet("user/{userId}/token/exist")]
        public async Task<bool> CheckIfUserHasToken(int userId)
        {
            return await _synchronizationService.CheckIfUserHasToken(userId);
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
        public async Task SetUpAccessToken(int userId, [FromBody]AccessTokenDTO token)
        {
            await _synchronizationService.SetUpUserToken(userId, token.Token);
        }
    }
}
