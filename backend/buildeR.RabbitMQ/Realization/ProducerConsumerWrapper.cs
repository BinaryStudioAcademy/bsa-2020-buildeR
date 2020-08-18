using buildeR.RabbitMq.Interfaces;
using buildeR.RabbitMq.Models;
using RabbitMQ.Client;

namespace buildeR.RabbitMq.Realization
{
    public class ProducerConsumerWrapper: IProducerConsumerWrapper
    {
        readonly IConnectionFactory _connectionFactory;

        public ProducerConsumerWrapper(IConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public IConsumer GetConsumer(QueueSettings settings)
        {
            return new Consumer(_connectionFactory, settings);
        }

        public IProducer GetProducer(QueueSettings settings)
        {
            return new Producer(_connectionFactory, settings);
        }
    }
}
