using System;
using System.Threading;
using System.Threading.Tasks;
using buildeR.Common.DTO;
using buildeR.SignalR.Hubs;
using buildeR.SignalR.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;

namespace buildeR.SignalR
{
    public class Worker : BackgroundService
    {
        private Thread _pollLoopThread;
        private readonly CancellationTokenSource _cancellationTokenSource = new CancellationTokenSource();
        private readonly string _topic;
        private readonly IHubContext<LogsHub> _logsHubContext;

        private readonly KafkaConsumer _kafkaConsumer;

        public Worker(IConfiguration config, IHubContext<LogsHub> logsHubContext)
        {
            _topic = "weblog";
            _logsHubContext = logsHubContext;
            _kafkaConsumer = new KafkaConsumer(config, _topic);
        }

        protected override Task ExecuteAsync(CancellationToken cancellationToken)
        {
            // We need thread because kafka consuming can't be done asynchronously 
            _pollLoopThread = new Thread(() =>
            {
                try
                {
                    using var consumer = _kafkaConsumer.consumer;
                    consumer.Subscribe(_topic);

                    try
                    {
                        while (!_cancellationTokenSource.IsCancellationRequested)
                        {
                            var cr = consumer.Consume(_cancellationTokenSource.Token);

                            var groupId = JsonConvert.DeserializeObject<ProjectLog>(cr.Message.Value).ProjectId.ToString();
                            // Broadcast is a method that will be called on client to receive messages
                            _logsHubContext.Clients.Group(groupId).SendAsync("Broadcast", $"{cr.Message.Value}");
                        }
                    }
                    catch (OperationCanceledException) { }

                    consumer.Close();
                }
                catch
                {

                }
            });

            _pollLoopThread.Start();

            return Task.CompletedTask;
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            await Task.Run(() =>
            {
                _cancellationTokenSource.Cancel();
                _pollLoopThread.Join();
            });
        }
    }
}