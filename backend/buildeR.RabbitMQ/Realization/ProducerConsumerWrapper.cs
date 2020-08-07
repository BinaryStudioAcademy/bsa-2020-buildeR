using buildeR.RabbitMq.Interfaces;
using buildeR.RabbitMq.Models;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.RabbitMq.Realization
{
    public class ProducerConsumerWrapper: IProducerConsumerWrapper
    {
        IConnectionFactory _connectionFactory;

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
