using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.BLL.Quartz;
using buildeR.Common.DTO.Quartz;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace buildeR.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrrigersController : ControllerBase
    {
        private readonly IQuartzService _quartzService;
        public TrrigersController(IQuartzService quartzService)
        {
            _quartzService = quartzService;
        }
        [HttpGet]
        public async Task<List<QuartzInfo>> GetAll()
        {
            return await _quartzService.GetAll();
        }

        [HttpPost]
        public async Task Post(string jobId, string cronExpression)
        {
            //string guid = Guid.NewGuid().ToString();
            //var data = new JobMetadata(guid, typeof(NotificationJob), "Notification Job", "0/10 * * * * ?");
            var data = new JobMetadata(jobId, typeof(NotificationJob), "Notification Job", cronExpression);
            await _quartzService.AddScheduleJob(data);

        }

        [HttpPut]
        public async Task Put(string jobId, string cronExpression)
        {
            var data = new JobMetadata(jobId, typeof(NotificationJob), "Notification Job", cronExpression);
            await _quartzService.UpdateScheduleJob(jobId, data);
        }

        [HttpDelete("{id}")]
        public async Task Delete(string id)
        {
            await _quartzService.DeletScheduleJob(id);
        }
    }
}
