﻿using Microsoft.Extensions.Hosting;
using Quartz;
using System.Threading;
using System.Threading.Tasks;

namespace buildeR.API.HostedServices
{
    public class QuartzHostedService : IHostedService
    {
        private readonly IScheduler _scheduler;

        public QuartzHostedService(IScheduler scheduler)
        {
            _scheduler = scheduler;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            await _scheduler?.Start(cancellationToken);
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            await _scheduler?.Shutdown(cancellationToken);
        }
    }
}
