using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO;
using buildeR.Common.Extensions;
using buildeR.RabbitMq.Models;
using Microsoft.Extensions.Hosting;
using buildeR.RabbitMq.Realization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace buildeR.HostedServices
{
    public class BuildStatusesQueueConsumerService : BackgroundService
    {
        private readonly Consumer _consumer;
        private readonly IServiceProvider _serviceProvider;

        public BuildStatusesQueueConsumerService(IConfiguration configuration, IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
            var settings = configuration.Bind<QueueSettings>("Queues:BuildStatuses");
            _consumer = new Consumer(OwnConnectionFactory.GetConnectionFactory(configuration), settings);

        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            stoppingToken.ThrowIfCancellationRequested();
            
            _consumer.Consume();
            _consumer.Received += ConsumerReceived;

            return Task.CompletedTask;
        }

        private async void ConsumerReceived(object sender, RabbitMQ.Client.Events.BasicDeliverEventArgs e)
        {
            var message = Encoding.UTF8.GetString(e.Body.ToArray());
            var statusChange = JsonConvert.DeserializeObject<StatusChangeDto>(message);

            using (var scope = _serviceProvider.CreateScope())
            {
                using var buildService = scope.ServiceProvider.GetService<IBuildService>();
                await buildService.ChangeStatus(statusChange);
            }

            _consumer.SetAcknowledge(e.DeliveryTag, true);
        }
    }
}