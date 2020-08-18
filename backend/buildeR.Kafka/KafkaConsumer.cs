using Confluent.Kafka;
using Microsoft.Extensions.Configuration;
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
        public KafkaConsumer(IConfiguration configuration, string topic)
        {
            var _section = configuration.GetSection("Kafka");
            _consumerConfig = new ConsumerConfig
            {
                GroupId = _section["GroupId"],
                BootstrapServers = _section["BootstrapServers"]
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
