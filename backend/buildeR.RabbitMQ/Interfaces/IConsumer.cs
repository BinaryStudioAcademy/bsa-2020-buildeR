using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.RabbitMq.Interfaces
{
    public interface IConsumer
    {
        event EventHandler<BasicDeliverEventArgs> Received;
        void Consume();
        void SetAcknowledge(ulong deliveryTag, bool processed);
    }
}
