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
  
    [Route("[controller]")]
    [ApiController]
    public class SynchronizationController : ControllerBase
    {
        private readonly ISynchronizationService _synchronizationService;
        private readonly LinkGenerator _linkGenerator;
        public SynchronizationController(ISynchronizationService synchronizationService, LinkGenerator linkGenerator)
        {
            _synchronizationService = synchronizationService;
            _linkGenerator = linkGenerator;
        }

        [HttpGet("repos/")]
        public async Task<IEnumerable<Repository>> GetUserRepositories([FromBody]Credentials credentials)
        {
            return await _synchronizationService.GetUserRepositories(credentials.Username, credentials.Password);
        }

        [HttpGet("{projectId}/branches")]
        public async Task<IEnumerable<Branch>> GetRepositoryBranches(int projectId)
         {
            return await _synchronizationService.GetRepositoryBranches(projectId);
        }

        [HttpPost("repo/exist")]
        public async Task<bool> CheckIfRepositoryAccessable([FromBody]RepositoryLinkDTO linkDTO)
        {
            return await _synchronizationService.CheckIfRepositoryAccessable(linkDTO.Link);
        }

        [HttpPost("hooks/{projectId}")]
        public async Task RegisterWebhooks(int projectId)
        {
            var callback = Url.RouteUrl("Webhooks", new { controller = $"webhooks" }, Request.Scheme);

            await _synchronizationService.RegisterWebhook(projectId, callback);
        }
    }
}
