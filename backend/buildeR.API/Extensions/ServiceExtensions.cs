using AutoMapper;
using buildeR.BLL.Interfaces;
using buildeR.BLL.MappingProfiles;
using buildeR.BLL.RabbitMQ;
using buildeR.BLL.Services;
using buildeR.BLL.Services.Abstract;

using buildeR.Common.DTO.User;
using buildeR.DAL.Entities;
using buildeR.RabbitMq.Models;
using buildeR.RabbitMq.Realization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace buildeR.API.Extensions
{
    public static class ServiceExtensions
    {
        public static void RegisterCustomServices(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IProjectService, ProjectService>();

            services.RegisterAutoMapper();

        }
        public static void RegisterAutoMapper(this IServiceCollection services)
        {
            services.AddAutoMapper(cfg =>
            {
                cfg.AddProfile<UserProfile>();
                cfg.AddProfile<ProjectProfile>();
                cfg.AddProfile<BuildPluginParameterProfile>();
                cfg.AddProfile<BuildStepProfile>();
            },
            Assembly.GetExecutingAssembly());
        }
        public static void RegisterRabbitMQ(this IServiceCollection services, IConfiguration configuration)
        {
            QueueSettings queueSettings = configuration.GetSection("Queues:ToProcessor").Get<QueueSettings>();
            services.AddTransient<ProcessorProducer>(sp => new ProcessorProducer(OwnConnectionFactory.GetConnetionFactory(), queueSettings));
        }
    }
}