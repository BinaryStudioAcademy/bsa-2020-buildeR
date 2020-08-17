using Confluent.Kafka;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace buildeR.SignalR.Services
{
    public class KafkaConsumer
    {
        private ConsumerConfig _consumerConfig;
        private string _topic;
        public IConsumer<Null, string> consumer;
        public KafkaConsumer(string topic)
        {
            _consumerConfig = new ConsumerConfig
            {
                GroupId = "logs-consumers-group",
                BootstrapServers = "localhost:9092",
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
