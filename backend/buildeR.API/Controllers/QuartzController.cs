using System.Collections.Generic;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.Quartz;
using Microsoft.AspNetCore.Mvc;

namespace buildeR.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuartzController : ControllerBase
    {
        private readonly IQuartzService _quartzService;
        public QuartzController(IQuartzService quartzService)
        {
            _quartzService = quartzService;
        }
        [HttpGet]
        public async Task<List<QuartzInfoDTO>> GetAll()
        {
            return await _quartzService.GetAll();
        }
        [HttpGet("{id}")]
        public async Task<QuartzInfoDTO> GetById(string id)
        {
            return await _quartzService.GetById(id);
        }
        [HttpPost]
        public async Task Post(QuartzDTO quartzDTO)
        {         
            await _quartzService.AddScheduleJob(quartzDTO);
        }

        [HttpPut("{id}/{group}")]
        public async Task Put(string id, string group, QuartzDTO quartzDTO)
        {
            await _quartzService.UpdateScheduleJob(id, group, quartzDTO);
        }

        [HttpDelete("{id}/{group}")]
        public async Task Delete(string id, string group)
        {
            await _quartzService.DeletScheduleJob(id, group);
        }
    }
}
