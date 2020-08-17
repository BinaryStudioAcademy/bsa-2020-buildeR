using buildeR.Common.DTO.Quartz;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IQuartzService
    {
        Task<List<QuartzInfoDTO>> GetAllTriggersByProjectId(string projectId);
        Task<QuartzInfoDTO> GetByTriggerIdAndProjectId(string triggerId, string projectId);
        Task<QuartzInfoDTO> AddScheduleJob(QuartzDTO quartzDTO);
        Task<QuartzInfoDTO> UpdateScheduleJob(QuartzDTO quartzDTO);
        Task DeletScheduleJob(QuartzDTO quartzDTO);
    }
}
