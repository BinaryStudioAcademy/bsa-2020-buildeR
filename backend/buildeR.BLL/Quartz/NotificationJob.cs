using Quartz;
using System;
using System.Threading.Tasks;

namespace buildeR.BLL.Quartz
{
    [DisallowConcurrentExecution]
    public class NotificationJob : IJob
    {
        public Task Execute(IJobExecutionContext context)
        {
            JobKey key = context.JobDetail.Key;

            Console.WriteLine($"Hello world! [key] - {key} - {DateTime.Now.ToShortTimeString()}");
            return Task.CompletedTask;
        }
    }
}
