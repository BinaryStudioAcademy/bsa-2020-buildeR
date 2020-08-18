using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.Webhooks.Github.PayloadDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace buildeR.API.Controllers
{
    [AllowAnonymous]
    [Route("{controller}", Name = "Webhooks")]
    [ApiController]
    public class WebhooksController : ControllerBase
    {
        private readonly IBuildOperationsService _builder;

        public WebhooksController(IBuildOperationsService builder)
        {
            _builder = builder;
        }

        [HttpPost()]
        public async Task WebhookCallback()
        {

        }

        [HttpPost("{projectId}/github")]
        public async Task GithubWebhookCallback(int projectId, [FromBody]PushGithubPayloadDTO payload)
        {
            await _builder.StartBuild(projectId);
        }
    }
}
