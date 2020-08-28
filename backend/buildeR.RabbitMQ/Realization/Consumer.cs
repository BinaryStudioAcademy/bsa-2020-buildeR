using buildeR.RabbitMq.Interfaces;
using buildeR.RabbitMq.Models;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;

namespace buildeR.RabbitMq.Realization
{
    public class Consumer : IConsumer
    {
        private readonly EventingBasicConsumer _consumer;
        public event EventHandler<BasicDeliverEventArgs> Received
        {
            add => _consumer.Received += value;
            remove => _consumer.Received -= value;
        }
        private readonly IModel _model;
        private readonly QueueSettings _queueSettings;

        public Consumer(IConnectionFactory factory, QueueSettings settings)
        {
            _model = new QueueService(factory, settings).GetModel();
            _consumer = new EventingBasicConsumer(_model);
            _queueSettings = settings;
        }
        public void Consume()
        {
            _model.BasicConsume(_queueSettings.QueueName, false, _consumer);
        }

        public void SetAcknowledge(ulong deliveryTag, bool processed)
        {
            if (processed)
            {
                _model.BasicAck(deliveryTag, multiple: false);
            }
            else
            {
                _model.BasicNack(deliveryTag, multiple: false, requeue: true);
            }
        }
    }
}
