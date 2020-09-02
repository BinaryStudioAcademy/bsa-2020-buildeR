using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using buildeR.Common.DTO;
using buildeR.Common.DTO.Notification;
using buildeR.Common.Enums;
using buildeR.Common.Extensions;
using buildeR.RabbitMq.Models;
using buildeR.RabbitMq.Realization;
using buildeR.SignalR.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;

namespace buildeR.SignalR.HostedServices
{
    public class BuildStatusesQueueConsumerService : BackgroundService
    {
        private readonly Consumer _consumer;
        private readonly IHubContext<BuildStatusesHub> _statusesHub;
        private readonly IHubContext<NotificationsHub> _notificationsHub;

        public BuildStatusesQueueConsumerService(IConfiguration configuration,
            IHubContext<BuildStatusesHub> statusesHub, IHubContext<NotificationsHub> notificationsHub)
        {
            _statusesHub = statusesHub;
            _notificationsHub = notificationsHub;
            var settings = configuration.Bind<QueueSettings>("Queues:BuildStatusesToSignalR");
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

            await _statusesHub.Clients.Group(statusChange.UserId.ToString()).SendAsync("statusChange", message);

            _consumer.SetAcknowledge(e.DeliveryTag, true);
        }
    }
}