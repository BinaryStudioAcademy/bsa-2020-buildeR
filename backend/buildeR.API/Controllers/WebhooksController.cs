using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        [HttpPost()]
        public async Task WebhookCallback()
        {

        }

        [HttpPost("{projectId}/github")]
        public async Task GithubWebhookCallback()
        {

        }
    }
}
