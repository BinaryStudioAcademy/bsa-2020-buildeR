using buildeR.RabbitMq.Models;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.RabbitMq.Realization
{
    public static class OwnConnectionFactory
    {
        public static IConnectionFactory GetConnetionFactory()
        {
            IConnectionFactory factory = new ConnectionFactory()
            {
                HostName = ConnectionFactorySettings.HostName,
                Port = ConnectionFactorySettings.Host,
                UserName = ConnectionFactorySettings.UserName,
                Password = ConnectionFactorySettings.Password,
                VirtualHost = ConnectionFactorySettings.VirtualHost,
                ContinuationTimeout = ConnectionFactorySettings.ContinuationTimeout,
            };
            return factory;
        }
    }
}
