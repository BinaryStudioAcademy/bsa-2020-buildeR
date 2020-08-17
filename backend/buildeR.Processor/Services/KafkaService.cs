using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Confluent.Kafka;
using Newtonsoft.Json;

namespace buildeR.Processor.Services
{
    public class KafkaService
    {
        private ProducerConfig _config;
        private IProducer<Null, string> _producer;
        private string _topic;
        public KafkaService()
        {
            _topic = "weblog";

            _config = new ProducerConfig
            {
                BootstrapServers = "localhost:9092"
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
