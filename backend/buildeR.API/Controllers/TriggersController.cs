using System.Collections.Generic;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.ProjectTrigger;
using Microsoft.AspNetCore.Mvc;

namespace buildeR.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TriggersController : ControllerBase
    {
        private readonly ITriggerService _triggerService;
        public TriggersController(ITriggerService triggerService)
        {
            _triggerService = triggerService;
        }
        [HttpGet("{id}")]
        public async Task<ProjectTriggerInfoDTO> GetTriggerById(int id)
        {
            return await _triggerService.GetTriggerInfoById(id);
        }
        [HttpGet("GetByProjectId/{projectId}")]
        public async Task<IEnumerable<ProjectTriggerInfoDTO>> GetByProjectId(int projectId)
        {
            return await _triggerService.GetAllByProjectId(projectId);
        }
        [HttpPost]
        public async Task<ProjectTriggerInfoDTO> Post(NewProjectTriggerDTO newTriggerDTO)
        {
            return await _triggerService.CreateTrigger(newTriggerDTO);
        }

        [HttpPut]
        public async Task<ProjectTriggerInfoDTO> Put(ProjectTriggerDTO triggerDTO)
        {
            return await _triggerService.UpdateTrigger(triggerDTO);
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _triggerService.DeleteTrigger(id);
        }
    }
}
