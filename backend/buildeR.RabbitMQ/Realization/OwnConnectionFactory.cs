using buildeR.RabbitMq.Models;
using Microsoft.Extensions.Configuration;
using RabbitMQ.Client;

namespace buildeR.RabbitMq.Realization
{
    public static class OwnConnectionFactory
    {
        public static IConnectionFactory GetConnectionFactory(IConfiguration configuration)
        {
            var settings = new ConnectionFactorySettings(configuration);
            IConnectionFactory factory = new ConnectionFactory
            {
                HostName = "localhost",
                Port = settings.Host,
                UserName = settings.UserName,
                Password = settings.Password,
                VirtualHost = settings.VirtualHost,
                ContinuationTimeout = settings.ContinuationTimeout,
            };
            return factory;
        }
    }
}
