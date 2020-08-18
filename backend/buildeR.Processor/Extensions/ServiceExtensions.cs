using buildeR.Common.Extensions;
using buildeR.Processor.Services;
using buildeR.RabbitMq.Interfaces;
using buildeR.RabbitMq.Models;
using buildeR.RabbitMq.Realization;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using RabbitMQ.Client;

using System;

namespace buildeR.Processor.Extensions
{
    public static class ServiceExtensions
    {
        public static void RegisterConnectionFactory(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<IConnectionFactory>(_ => OwnConnectionFactory.GetConnectionFactory(configuration));
            services.AddSingleton<IProducerConsumerWrapper, ProducerConsumerWrapper>();
        }

        public static void RegisterServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<ProcessorService>(serviceProvider => ProcessServiceFactory(serviceProvider, configuration));
        }

        private static ProcessorService ProcessServiceFactory(IServiceProvider serviceProvider, IConfiguration configuration)
        {
            var connectionProvider = serviceProvider.GetService<IProducerConsumerWrapper>();
            var consumer = connectionProvider.GetConsumer(configuration.Bind<QueueSettings>("RabbitMQ:Queues:FromAPIToProcessor"));
            return new ProcessorService(configuration, consumer);
        }
    }
}
