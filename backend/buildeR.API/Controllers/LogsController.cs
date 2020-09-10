using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace buildeR.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class LogsController : ControllerBase
    {
        private readonly IBuildLogService _logService;

        public LogsController(IBuildLogService logService)
        {
            _logService = logService;
        }

        [HttpGet("{projectId}/{buildHistoryId}")]
        public async Task<List<ProjectLog>> GetLogs(int projectId, int buildHistoryId)
        {
            return await _logService.GetLogs(projectId, buildHistoryId);
        }
    }
}
