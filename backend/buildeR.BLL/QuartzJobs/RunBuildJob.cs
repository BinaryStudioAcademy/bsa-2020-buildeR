using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.BuildHistory;
using Microsoft.Extensions.DependencyInjection;
using Quartz;
using System;
using System.Threading.Tasks;

namespace buildeR.BLL.QuartzJobs
{
    [DisallowConcurrentExecution]
    public class RunBuildJob : IJob
    {
        private readonly IServiceProvider _provider;
        public RunBuildJob(IServiceProvider provider)
        {
            _provider = provider;
        }
        public async Task Execute(IJobExecutionContext context)
        {
            using (var scope = _provider.CreateScope())
            {
                var branch = context.JobDetail.Description;
                int projectId = Convert.ToInt32(context.JobDetail.Key.Group);
                var buildOperationService = scope.ServiceProvider.GetRequiredService<IBuildOperationsService>();

                var buildHistory = await buildOperationService.PrepareBuild(projectId, "BuilderBot", branch);
                await buildOperationService.StartBuild(projectId, buildHistory.Id, branch, null);
            }
        }
    }
}
