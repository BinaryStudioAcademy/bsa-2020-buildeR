using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.ProjectRemoteTrigger;
using buildeR.Common.DTO.ProjectTrigger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace buildeR.API.Controllers
{
    [Authorize]
    [Route("remote-triggers")]
    [ApiController]
    public class RemoteTriggersController : ControllerBase
    {
        private readonly IProjectRemoteTriggerService _triggerService;

        public RemoteTriggersController(IProjectRemoteTriggerService triggerService)
        {
            _triggerService = triggerService;
        }

        [HttpGet("project-triggers/{projectId}")]
        public async Task<IEnumerable<ProjectRemoteTriggerDTO>> GetProjectTriggers(int projectId)
        {
            return await _triggerService.GetProjectTriggers(projectId);
        }

        [HttpPost()]
        public async Task<ProjectRemoteTriggerDTO> CreateTrigger([FromBody]NewProjectRemoteTriggerDTO trigger)
        {
            return await _triggerService.CreateProejectTrigger(trigger);
        }

        [HttpPut()]
        public async Task<ProjectRemoteTriggerDTO> UpdateTrigger([FromBody]ProjectRemoteTriggerDTO trigger)
        {
            return await _triggerService.UpdateProjectTrigger(trigger);
        }

        [HttpDelete("{triggerId}")]
        public async Task DeleteTrigger(int triggerId)
        {
            await _triggerService.DeleteProjectTrigger(triggerId);
        }
    }
}
