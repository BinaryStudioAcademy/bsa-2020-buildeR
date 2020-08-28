using buildeR.Common.DTO;
using buildeR.Common.Extensions;
using buildeR.Processor.Services;
using buildeR.RabbitMq.Interfaces;
using buildeR.RabbitMq.Models;
using buildeR.RabbitMq.Realization;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Nest;
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
            var consumer = connectionProvider.GetConsumer(configuration.Bind<QueueSettings>("Queues:FromAPIToProcessor"));
            var buildStatusesProducer = connectionProvider.GetProducer(configuration.Bind<QueueSettings>("Queues:BuildStatuses"));

            var elasticClient = serviceProvider.GetService<IElasticClient>();

            return new ProcessorService(configuration, consumer, buildStatusesProducer, elasticClient);
        }
        public static void AddElasticsearch(this IServiceCollection services, IConfiguration configuration)
        {
            var url = configuration["ElasticConfiguration:Uri"];
            var defaultIndex = configuration["ElasticConfiguration:Index"];

            var settings = new ConnectionSettings(new Uri(url))
                .DefaultIndex(defaultIndex)
                .DefaultMappingFor<ProjectLog>(m => m
                    .Ignore(p => p.Timestamp)
                    .PropertyName(p => p.BuildStep, "id")
                );

            var client = new ElasticClient(settings);

            services.AddSingleton<IElasticClient>(client);
        }
    }
}
