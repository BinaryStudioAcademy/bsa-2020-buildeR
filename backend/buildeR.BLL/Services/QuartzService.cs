using buildeR.BLL.Exceptions;
using buildeR.BLL.Interfaces;
using buildeR.BLL.QuartzJobs;
using buildeR.Common.DTO.Quartz;
using Quartz;
using Quartz.Impl.Matchers;
using System.Collections.Generic;
using System.Linq;
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

        public async Task<List<QuartzInfoDTO>> GetAll()
        {
            List<QuartzInfoDTO> infos = new List<QuartzInfoDTO>();
            List<JobKey> jobKeys = await JobKeys();
            foreach (var jobKey in jobKeys)
            {
                var triggers = await _scheduler.GetTriggersOfJob(jobKey);
                foreach (var trigger in triggers)
                {                     
                    string cron = "";
                    if (trigger is ICronTrigger cronTrigger)
                    {
                        cron = cronTrigger.CronExpressionString;
                    }
                    QuartzInfoDTO info = new QuartzInfoDTO()
                    {
                        Id = jobKey.Name,
                        Group = jobKey.Group,
                        Description = trigger.Description,
                        TriggerType = trigger.GetType().Name,
                        CronExpression = cron,
                        NextFireTime = trigger.GetNextFireTimeUtc(),
                        PreviousFireTime = trigger.GetPreviousFireTimeUtc(),
                    };
                    infos.Add(info); 
                }
            }
            return infos;
        }
        public async Task<QuartzInfoDTO> GetById(string id)
        {
            List<JobKey> jobKeys = await JobKeys();

            var jobKey = jobKeys.FirstOrDefault(x => x.Name == id);
            if (jobKey != null)
            {
                var triggers = await _scheduler.GetTriggersOfJob(jobKey);
                var trigger = triggers.FirstOrDefault(x => x.Key.ToString() == jobKey.ToString());
                if (trigger != null)
                {
                    string cron = "";
                    if (trigger is ICronTrigger cronTrigger)
                    {
                        cron = cronTrigger.CronExpressionString;
                    }
                    var info = new QuartzInfoDTO()
                    {
                        Id = jobKey.Name,
                        Group = jobKey.Group,
                        Description = trigger.Description,
                        TriggerType = trigger.GetType().Name,
                        CronExpression = cron,
                        NextFireTime = trigger.GetNextFireTimeUtc(),
                        PreviousFireTime = trigger.GetPreviousFireTimeUtc(),
                    };
                    return info;
                }
                throw new NotFoundException($"triger with id - {id}");
            }
            throw new NotFoundException($"jod with id - {id}");
        }
        public async Task AddScheduleJob(QuartzDTO quartzDTO)
        {
            var job = CreateJob(quartzDTO);
            var trigger = CreateTrigger(quartzDTO);
            await _scheduler.ScheduleJob(job, trigger);
        }
        public async Task UpdateScheduleJob(string id, string group, QuartzDTO quartzDTO)
        {
            TriggerKey oldTriggerKey = new TriggerKey(id, group);
            quartzDTO.Id = id;
            var trigger = CreateTrigger(quartzDTO);
            await _scheduler.RescheduleJob(oldTriggerKey, trigger);
        }
        public async Task DeletScheduleJob(string id, string group)
        {
            TriggerKey triggerKey = new TriggerKey(id, group);         
            await _scheduler.UnscheduleJob(triggerKey);
        }
        private IJobDetail CreateJob(QuartzDTO quartzDTO)
        {
            return JobBuilder
            .Create<PrintToConsoleJob>()
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
        private async Task<List<JobKey>> JobKeys()
        {
            List<JobKey> jobKeys = new List<JobKey>();
            IReadOnlyCollection<string> jobGroups = await _scheduler.GetJobGroupNames();
            foreach (string group in jobGroups)
            {
                var groupMatcher = GroupMatcher<JobKey>.GroupContains(group);
                var jobKeysFromGroup = await _scheduler.GetJobKeys(groupMatcher);
                jobKeys.AddRange(jobKeysFromGroup);
            }
            return jobKeys;
        }

    }

}
