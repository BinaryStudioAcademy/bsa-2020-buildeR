using buildeR.RabbitMq.Models;
using buildeR.RabbitMq.Realization;
using RabbitMQ.Client;

namespace buildeR.BLL.RabbitMQ
{
    public class NotificationsProducer : Producer
    {
        public NotificationsProducer(IConnectionFactory connectionFactory, QueueSettings settings) : base(connectionFactory, settings)
        {
        }
    }
}