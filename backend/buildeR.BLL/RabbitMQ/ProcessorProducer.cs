using buildeR.RabbitMq.Models;
using buildeR.RabbitMq.Realization;
using RabbitMQ.Client;

namespace buildeR.BLL.RabbitMQ
{
    public class ProcessorProducer: Producer
    {
        public ProcessorProducer(IConnectionFactory connectionFactory, QueueSettings settings): base(connectionFactory, settings)
        { }
    }
}
