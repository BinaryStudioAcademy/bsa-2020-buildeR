using buildeR.Common.DTO.Quartz;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IQuartzService
    {
        public Task<List<QuartzInfoDTO>> GetAll();
        public Task<QuartzInfoDTO> GetById(string id);
        public Task AddScheduleJob(QuartzDTO quartzDTO);
        public Task UpdateScheduleJob(string id, string group, QuartzDTO quartzDTO);
        public Task DeletScheduleJob(string id, string group);
    }
}
