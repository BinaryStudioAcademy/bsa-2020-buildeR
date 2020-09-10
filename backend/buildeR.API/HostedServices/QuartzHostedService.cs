using buildeR.DAL.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Quartz;
using Quartz.Spi;
using System.Threading;
using System.Threading.Tasks;

namespace buildeR.API.HostedServices
{
    public class QuartzHostedService : IHostedService
    {
        private readonly IScheduler _scheduler;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly IJobFactory _jobFactory;
        public QuartzHostedService(IScheduler scheduler, IServiceScopeFactory serviceScopeFactory, IJobFactory jobFactory)
        {
            _scheduler = scheduler;
            _serviceScopeFactory = serviceScopeFactory;
            _jobFactory = jobFactory;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            await InitDatabase();
            _scheduler.JobFactory = _jobFactory;
            await _scheduler?.Start(cancellationToken);
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            await _scheduler?.Shutdown(cancellationToken);
        }

        private async Task InitDatabase()
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                using var contextQuartz = scope.ServiceProvider.GetRequiredService<QuartzDBContext>();
                await contextQuartz.Database.MigrateAsync();
            };
        }
    }
}
