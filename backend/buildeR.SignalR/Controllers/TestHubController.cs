using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using buildeR.SignalR.Hubs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;

namespace buildeR.SignalR.Controllers
{
    [Route("test/")]
    [ApiController]
    public class TestHubController : ControllerBase
    {
        IHubContext<TestHub> _hubContext;

        public TestHubController(IHubContext<TestHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task Broadcast()
        {
            await _hubContext.Clients.All.SendAsync("Send", "success");
        }
    }
}
