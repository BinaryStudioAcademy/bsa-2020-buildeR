using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.RabbitMq.Models
{
    public class QueueSettings
    {
        public string QueueName { get; set; }
        public string ExchangeName { get; set; }
        public string RoutingKey { get; set; }
        public string ExchangeType { get; set; }
    }
}
