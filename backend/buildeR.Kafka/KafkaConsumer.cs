using Confluent.Kafka;
using Microsoft.Extensions.Configuration;

namespace buildeR.SignalR.Services
{
    public class KafkaConsumer
    {
        private readonly ConsumerConfig _consumerConfig;
        private readonly string _topic;
        public readonly IConsumer<Null, string> consumer;

        public KafkaConsumer(IConfiguration configuration, string topic)
        {
            _consumerConfig = new ConsumerConfig
            {
                GroupId = configuration["Kafka:GroupId"],
                BootstrapServers = configuration["Kafka:BootstrapServers"]
            };
            _topic = topic;
            consumer = BuildConsumer();
        }

        private IConsumer<Null, string> BuildConsumer()
        {
            return new ConsumerBuilder<Null, string>(_consumerConfig).Build();
        }
    }
}
