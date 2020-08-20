using AutoMapper;
using buildeR.BLL.Interfaces;
using buildeR.BLL.MappingProfiles;
using buildeR.BLL.Providers;
using buildeR.BLL.RabbitMQ;
using buildeR.BLL.Services;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.Extensions;
using buildeR.RabbitMq.Models;
using buildeR.RabbitMq.Realization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Quartz;
using Quartz.Impl;
using System;
using System.Collections.Specialized;
using System.Reflection;

namespace buildeR.API.Extensions
{
    public static class ServiceExtensions
    {
        public static void RegisterCustomServices(this IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddControllers()
                .AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IProjectService, ProjectService>();
            services.AddScoped<IQuartzService, QuartzService>();
            services.AddScoped<ITriggerService, TriggerService>();
            services.AddSingleton(provider => GetScheduler(configuration));
            services.AddScoped<IGroupService, GroupService>();
            services.AddScoped<IBuildStepService, BuildStepService>();
            services.AddScoped<IBuildService, BuildService>();
            services.AddScoped<IGithubClient, GithubClient>();
            services.AddScoped<ISynchronizationService, SynchronizationService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IEmailBuilder, EmailBuilder>();
            services.AddScoped<INotificationSettingService, NotificationSettingService>();

            services.AddTransient<IBuildOperationsService, BuildOperationsService>();
            services.AddTransient<IWebhooksHandler, WebhooksHandler>();
            services.RegisterAutoMapper();
        }
        public static void RegisterAutoMapper(this IServiceCollection services)
        {
            services.AddAutoMapper(Assembly.GetAssembly(typeof(UserProfile)));
        }
        public static void RegisterRabbitMQ(this IServiceCollection services, IConfiguration configuration)
        {
            var queueSettings = configuration.Bind<QueueSettings>("Queues:ToProcessor");
            services.AddTransient(sp => new ProcessorProducer(OwnConnectionFactory.GetConnectionFactory(configuration), queueSettings));
        }
        public static void RegisterHttpCients(this IServiceCollection services)
        {
            services.AddHttpClient("github", c =>
            {
                c.BaseAddress = new Uri("https://api.github.com/");
                c.DefaultRequestHeaders.Add("Accept", "application/vnd.github.v3+json");
                c.DefaultRequestHeaders.Add("User-Agent", "buildeR-http-client");
            });
        }

        private static IScheduler GetScheduler(IConfiguration configuration)
        {
            var properties = new NameValueCollection
            {
                // json serialization is the one supported under .NET Core (binary isn't)  NuGet --> Quartz.Serialization.Json
                ["quartz.serializer.type"] = "json",

                ["quartz.jobStore.type"] = "Quartz.Impl.AdoJobStore.JobStoreTX, Quartz",
                ["quartz.jobStore.useProperties"] = "false",
                ["quartz.jobStore.dataSource"] = "default",
                ["quartz.jobStore.tablePrefix"] = "QRTZ_",
                ["quartz.jobStore.driverDelegateType"] = "Quartz.Impl.AdoJobStore.SqlServerDelegate, Quartz",
                ["quartz.dataSource.default.provider"] = "SqlServer",
                ["quartz.dataSource.default.connectionString"] = configuration["ConnectionStrings:QuartzDBConnection"] // "Server=localhost;Database=QuartzDB;Trusted_Connection=true;"
            };
            var schedulerFactory = new StdSchedulerFactory(properties);
            var scheduler = schedulerFactory.GetScheduler().Result;
            scheduler.Start();
            return scheduler;
        }
    }
}