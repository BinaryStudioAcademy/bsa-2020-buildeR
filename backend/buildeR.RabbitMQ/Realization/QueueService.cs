using buildeR.RabbitMq.Interfaces;
using buildeR.RabbitMq.Models;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.RabbitMq.Realization
{
    public class QueueService : IQueue
    {
        private IConnection _connection;
        private IModel _model;

        public QueueService(IConnectionFactory factory, QueueSettings queueSettings)
        {
            _connection = factory.CreateConnection();
            _model = _connection.CreateModel();
            DeclareExchange(queueSettings.ExchangeName, queueSettings.ExchangeType);

            if(!string.IsNullOrEmpty(queueSettings.QueueName))
                BindQueue(queueSettings.ExchangeName, queueSettings.QueueName, queueSettings.RoutingKey);
        }

        public IModel GetModel()
        {
            return _model;
        }
        public void BindQueue(string exchangeName, string queueName, string routingKey)
        {
            _model.QueueDeclare(queueName, autoDelete: false, exclusive: false);
            _model.QueueBind(queueName, exchangeName, routingKey);
        }

        public void DeclareExchange(string exchangeName, string exchangeType)
        {
            _model.ExchangeDeclare(exchangeName, exchangeType ?? string.Empty);
        }
    }
}
