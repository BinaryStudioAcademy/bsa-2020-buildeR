using System;
using System.Threading;
using System.Threading.Tasks;
using buildeR.SignalR.Hubs;
using Confluent.Kafka;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace buildeR.SignalR
{
    public class Worker : BackgroundService
    {
        private Thread _pollLoopThread;
        private CancellationTokenSource _cancellationTokenSource = new CancellationTokenSource();
        private ConsumerConfig _consumerConfig;
        private string _topic;
        private IHubContext<LogsHub> _logsHubContext;

        public Worker(IHubContext<LogsHub> logsHubContext)
        {
            _consumerConfig = new ConsumerConfig
            {
                GroupId = "logs-consumers-group",
                BootstrapServers = "localhost:9092",
            };
            _topic = "weblog";
            _logsHubContext = logsHubContext;
        }

        protected override Task ExecuteAsync(CancellationToken cancellationToken)
        {
            // We need thread because kafka consuming can't be done asynchronously 
            _pollLoopThread = new Thread(() =>
            {
                try
                {
                    using (var consumer = new ConsumerBuilder<Null, string>(_consumerConfig).Build())
                    {
                        consumer.Subscribe(_topic);

                        try
                        {
                            while (!_cancellationTokenSource.IsCancellationRequested)
                            {
                                var cr = consumer.Consume(_cancellationTokenSource.Token);

                                // Broadcast is a method that will be called on client to receive messages
                                _logsHubContext.Clients.All.SendAsync("Broadcast", $"{cr.Message.Value}");
                            }
                        }
                        catch (OperationCanceledException) { }

                        consumer.Close();
                    }
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