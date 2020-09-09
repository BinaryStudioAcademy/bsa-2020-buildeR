using buildeR.BLL.Interfaces;
using buildeR.BLL.QuartzJobs;
using buildeR.Common.DTO.Quartz;
using Quartz;
using Quartz.Impl.Matchers;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class QuartzService : IQuartzService
    {
        private readonly IScheduler _scheduler;

        public QuartzService(IScheduler scheduler)
        {
            _scheduler = scheduler;
        }

        public async Task<List<QuartzInfoDTO>> GetAllTriggersByProjectId(string projectId)
        {
            List<QuartzInfoDTO> infos = new List<QuartzInfoDTO>();

            var groupMatcher = GroupMatcher<TriggerKey>.GroupContains(projectId);
            var triggerKeysFromGroup = await _scheduler.GetTriggerKeys(groupMatcher);
                foreach (var triggerKey in triggerKeysFromGroup)
                {
                    var trigger = await _scheduler.GetTrigger(triggerKey);
                    QuartzInfoDTO info = new QuartzInfoDTO()
                    {
                        Id = trigger.Key.Name,              // same as triggerId
                        Group = trigger.Key.Group,          // same as projectId
                        Description = trigger.Description,
                        CronExpression = (trigger is ICronTrigger cronTrigger) ? cronTrigger.CronExpressionString : "",
                        NextFireTime = trigger.GetNextFireTimeUtc().GetValueOrDefault().LocalDateTime,
                        PreviousFireTime = trigger.GetPreviousFireTimeUtc().GetValueOrDefault().LocalDateTime
                    };
                    infos.Add(info);
                }
            return infos;
        }
        public async Task<QuartzInfoDTO> GetByTriggerIdAndProjectId(string triggerId, string projectId)
        {
            var trigger = await _scheduler.GetTrigger(new TriggerKey(triggerId, projectId));

            QuartzInfoDTO info = new QuartzInfoDTO()
            {
                Id = trigger.Key.Name,                      // same as triggerId
                Group = trigger.Key.Group,                  // same as projectId
                Description = trigger.Description,
                CronExpression = (trigger is ICronTrigger cronTrigger) ? cronTrigger.CronExpressionString : "",
                NextFireTime = trigger.GetNextFireTimeUtc().GetValueOrDefault().LocalDateTime, 
                PreviousFireTime = trigger.GetPreviousFireTimeUtc().GetValueOrDefault().LocalDateTime,

            };
            return info;
        }
        public async Task<QuartzInfoDTO> AddScheduleJob(QuartzDTO quartzDTO)
        {
            var job = CreateJob(quartzDTO);
            var trigger = CreateTrigger(quartzDTO);
            await _scheduler.ScheduleJob(job, trigger);
            return await GetByTriggerIdAndProjectId(quartzDTO.Id, quartzDTO.Group);
        }
        public async Task<QuartzInfoDTO> UpdateScheduleJob(QuartzDTO quartzDTO)
        {
            TriggerKey triggerKey = new TriggerKey(quartzDTO.Id, quartzDTO.Group); 
            var trigger = CreateTrigger(quartzDTO);
            await _scheduler.RescheduleJob(triggerKey, trigger);
            return await GetByTriggerIdAndProjectId(quartzDTO.Id, quartzDTO.Group);
        }
        public async Task DeletScheduleJob(QuartzDTO quartzDTO)
        {
            TriggerKey triggerKey = new TriggerKey(quartzDTO.Id, quartzDTO.Group);
            await _scheduler.UnscheduleJob(triggerKey);
        }
        public async Task DeleteAllSheduleJob(string projectId)
        {
            var groupMatcher = GroupMatcher<JobKey>.GroupContains(projectId);
            var jobKeys = await _scheduler.GetJobKeys(groupMatcher);
            await _scheduler.DeleteJobs(jobKeys);
        }
        private IJobDetail CreateJob(QuartzDTO quartzDTO)
        {
            return JobBuilder
            .Create<RunBuildJob>()
            .WithIdentity(quartzDTO.Id, quartzDTO.Group)
            .WithDescription(quartzDTO.Description)
            .Build();
        }
        private ITrigger CreateTrigger(QuartzDTO quartzDTO)
        {
            return TriggerBuilder.Create()
            .WithIdentity(quartzDTO.Id, quartzDTO.Group)
            .WithCronSchedule(quartzDTO.CronExpression)
            .WithDescription(quartzDTO.Description)
            .Build();
        }
    }
}
