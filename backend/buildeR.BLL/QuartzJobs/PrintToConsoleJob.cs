using Quartz;
using System;
using System.Threading.Tasks;

namespace buildeR.BLL.QuartzJobs
{
    [DisallowConcurrentExecution]
    public class PrintToConsoleJob : IJob
    {
        public Task Execute(IJobExecutionContext context)
        {
            JobKey key = context.JobDetail.Key;

            Console.WriteLine($"Hello world! [key] - {key} - {DateTime.Now.ToLocalTime()}");
            return Task.CompletedTask;
        }
    }
}
