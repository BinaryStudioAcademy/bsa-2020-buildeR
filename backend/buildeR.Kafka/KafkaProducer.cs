using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Confluent.Kafka;
using buildeR.Common.DTO;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;

namespace buildeR.Kafka
{
    public class KafkaProducer
    {
        private ProducerConfig _config;
        private IProducer<Null, string> _producer;
        private string _topic;
        public KafkaProducer(IConfiguration configuration, string topic)
        {
            _topic = topic;

            _config = new ProducerConfig
            {
                BootstrapServers = configuration["Kafka:BootstrapServers"]
            };
            _producer = new ProducerBuilder<Null, string>(_config).Build();
        }

        public async Task SendLog(ProjectLog log)
        {
            string serializedLog = SerializeLog(log);
            await _producer.ProduceAsync(_topic, new Message<Null, string> { Value = serializedLog });
        }

        public string SerializeLog(ProjectLog log)
        {
            return JsonConvert.SerializeObject(log);
        }
    }
}
