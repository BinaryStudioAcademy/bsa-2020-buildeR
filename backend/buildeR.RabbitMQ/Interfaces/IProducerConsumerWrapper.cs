using buildeR.RabbitMq.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.RabbitMq.Interfaces
{
    public interface IProducerConsumerWrapper
    {
        IProducer GetProducer(QueueSettings settings);
        IConsumer GetConsumer(QueueSettings settings);
    }
}
