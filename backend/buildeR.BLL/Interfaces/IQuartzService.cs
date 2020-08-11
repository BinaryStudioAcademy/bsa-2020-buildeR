using buildeR.Common.DTO.Quartz;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IQuartzService
    {
        public Task<List<QuartzInfo>> GetAll();
        public Task AddScheduleJob(JobMetadata jobMetadata);
        public Task UpdateScheduleJob(string triggerKey, JobMetadata jobMetadata);
        public Task DeletScheduleJob(string triggerKey);
    }
}
