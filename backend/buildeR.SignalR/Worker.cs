using buildeR.SignalR.Hubs;
using Confluent.Kafka;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace buildeR.SignalR
{
    public class Worker : BackgroundService
    {
        private readonly IHubContext<LogsHub> _logsHub;

        public Worker(IHubContext<LogsHub> logsHub)
        {
            _logsHub = logsHub;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var conf = new ConsumerConfig
                {
                    GroupId = "test-consumer-group",
                    BootstrapServers = "localhost:9092",
                    // Note: The AutoOffsetReset property determines the start offset in the event
                    // there are not yet any committed offsets for the consumer group for the
                    // topic/partitions of interest. By default, offsets are committed
                    // automatically, so in this example, consumption will only start from the
                    // earliest message in the topic 'my-topic' the first time you run the program.
                    AutoOffsetReset = AutoOffsetReset.Earliest
                };

                using (var c = new ConsumerBuilder<Ignore, string>(conf).Build())
                {
                    c.Subscribe("weblog");

                    CancellationTokenSource cts = new CancellationTokenSource();
                    Console.CancelKeyPress += (_, e) =>
                    {
                        e.Cancel = true; // prevent the process from terminating.
                        cts.Cancel();
                    };
                    while (true)
                    {
                        var cr = c.Consume(cts.Token);

                        Console.WriteLine($"Consumed message '{cr.Message.Value}' at: '{cr.TopicPartitionOffset}'.");
                        await _logsHub.Clients.All.SendAsync("SendMessage", cr.Message.Value, cts.Token);
                    }
                }
            }
        }
    }
}
