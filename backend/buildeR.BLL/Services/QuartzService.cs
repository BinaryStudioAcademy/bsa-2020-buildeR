using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.Quartz;
using Quartz;
using Quartz.Impl.Matchers;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class QuartzService: IQuartzService
    {
        private readonly IScheduler _scheduler;
        public QuartzService(IScheduler scheduler)
        {
            _scheduler = scheduler;
        }
        public async Task<List<QuartzInfo>> GetAll()
        {
            List<QuartzInfo> infos = new List<QuartzInfo>();
            IReadOnlyCollection<string> jobGroups = await _scheduler.GetJobGroupNames();
            foreach (string group in jobGroups)
            {
                var groupMatcher = GroupMatcher<JobKey>.GroupContains(group);
                var jobKeys = await _scheduler.GetJobKeys(groupMatcher);
                foreach (var jobKey in jobKeys)
                {
                    var detail = await _scheduler.GetJobDetail(jobKey);
                    var triggers = await _scheduler.GetTriggersOfJob(jobKey);
                    foreach (ITrigger trigger in triggers)
                    {
                        var state = await _scheduler.GetTriggerState(trigger.Key);
                        QuartzInfo info = new QuartzInfo()
                        {
                            Group = group,
                            JobKeyName = jobKey.Name,
                            DetailDescription = detail.Description,
                            TriggerKeyName = trigger.Key.Name,
                            TriggerKeyGroup = trigger.Key.Group,
                            TriggerType = trigger.GetType().Name,
                            TriggerState = state.ToString(),
                            NextFireTime = trigger.GetNextFireTimeUtc(),
                            PreviousFireTime = trigger.GetPreviousFireTimeUtc()
                        };
                        infos.Add(info);
                    }
                }
            }
            return infos;
        }
        public async Task AddScheduleJob(JobMetadata jobMetadata)
        {
            var job = CreateJob(jobMetadata);
            var trigger = CreateTrigger(jobMetadata);
            await _scheduler.ScheduleJob(job, trigger);
        }
        public async Task UpdateScheduleJob(string triggerKey, JobMetadata jobMetadata)
        {
            TriggerKey oldTriggerKey1 = new TriggerKey(triggerKey);
            var trigger = CreateTrigger(jobMetadata);
            await _scheduler.RescheduleJob(oldTriggerKey1, trigger);
        }
        public async Task DeletScheduleJob(string triggerKey)
        {
            TriggerKey triggerKey1 = new TriggerKey(triggerKey);
            await _scheduler.UnscheduleJob(triggerKey1);
        }
        private ITrigger CreateTrigger(JobMetadata jobMetadata)
        {
            return TriggerBuilder.Create()
            .WithIdentity(jobMetadata.JobId)
            .WithCronSchedule(jobMetadata.CronExpression)
            .WithDescription($"{jobMetadata.JobName}")
            .Build();
        }
        private IJobDetail CreateJob(JobMetadata jobMetadata)
        {
            return JobBuilder
            .Create(jobMetadata.JobType)
            .WithIdentity(jobMetadata.JobId)
            .WithDescription($"{jobMetadata.JobName}")
            .Build();
        }
    }

}
