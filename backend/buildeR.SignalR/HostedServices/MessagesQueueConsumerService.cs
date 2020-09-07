using buildeR.Common.DTO.Message;
using buildeR.Common.Extensions;
using buildeR.RabbitMq.Models;
using buildeR.RabbitMq.Realization;
using buildeR.SignalR.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace buildeR.SignalR.HostedServices
{
    public class MessagesQueueConsumerService : BackgroundService
    {
        public Consumer _consumer;
        public IHubContext<MessagesHub> _hub;

        public MessagesQueueConsumerService(IConfiguration configuration, IHubContext<MessagesHub> hub)
        {
            _hub = hub;
            var settings = configuration.Bind<QueueSettings>("Queues:MessagesToSignalR");
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
            var messageSend = JsonConvert.DeserializeObject<MessageDTO>(message);
           
            await _hub.Clients.Group(messageSend.GroupId.ToString()).SendAsync("newMessage", message);

            _consumer.SetAcknowledge(e.DeliveryTag, true);
        }

    }

}
