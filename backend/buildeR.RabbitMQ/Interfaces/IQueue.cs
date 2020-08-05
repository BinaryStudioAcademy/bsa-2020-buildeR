using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.RabbitMq.Interfaces
{
    public interface IQueue
    {
        void DeclareExchange(string exchangeName, string exchangeType);
        void BindQueue(string exchangeName, string queueName, string routingKey);
        IModel GetModel();
    }
}
