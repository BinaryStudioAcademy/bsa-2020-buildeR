using buildeR.RabbitMq.Models;
using buildeR.RabbitMq.Realization;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.BLL.RabbitMQ
{
    public class MessagesProducer : Producer
    {
        public MessagesProducer(IConnectionFactory connectionFactory, QueueSettings settings) : base(connectionFactory, settings)
        {
        }
    }
}
