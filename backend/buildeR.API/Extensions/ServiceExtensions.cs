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
using System;
using System.Reflection;
using buildeR.API.HostedServices;
using buildeR.Common.DTO;
using Quartz.Impl;
using Quartz;
using System.Collections.Specialized;
using buildeR.API.HostedServices;
using Nest;
using buildeR.Common.DTO;

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
            services.AddScoped<IGroupService, GroupService>();
            services.AddScoped<IBuildStepService, BuildStepService>();
            services.AddScoped<ICommandArgumentService, CommandArgumentService>();
            services.AddScoped<IBuildService, BuildService>();
            services.AddScoped<IGithubClient, GithubClient>();
            services.AddScoped<ISynchronizationService, SynchronizationService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IEmailBuilder, EmailBuilder>();
            services.AddScoped<INotificationSettingService, NotificationSettingService>();
            services.AddScoped<ITeamMemberService, TeamMemberService>();
            services.AddScoped<IProjectGroupService, ProjectGroupService>();
            services.AddScoped<IChatService, ChatService>();
            services.AddScoped<INotificationsService, NotificationsService>();

            services.AddTransient<IHttpClient, BuilderHttpClient>();
            services.AddTransient<IPluginCommandService, PluginCommandService>();
            services.AddTransient<IBuildPluginService, BuildPluginService>();
            services.AddTransient<IBuildOperationsService, BuildOperationsService>();
            services.AddTransient<IWebhooksHandler, WebhooksHandler>();
            services.AddElasticsearch(configuration);
            services.AddTransient<ILogService, LogService>();
            services.AddTransient<ISecretService, SecretService>();
            services.AddHttpClient();
            services.AddTransient<IEnvironmentVariablesService, EnvironmentVariablesService>();
            services.AddTransient<IFileProvider, FileProvider>();
            services.AddTransient<ISynchronizationHelper, SynchronizationHelper>();
            services.AddTransient<IProjectRemoteTriggerService, ProjectRemoteTriggerService>();

            services.AddSingleton(GetScheduler(configuration));
            services.AddHostedService<QuartzHostedService>();

            services.RegisterAutoMapper();
        }

        public static void RegisterAutoMapper(this IServiceCollection services)
        {
            services.AddAutoMapper(Assembly.GetAssembly(typeof(UserProfile)));
        }

        public static void RegisterRabbitMQ(this IServiceCollection services, IConfiguration configuration)
        {
            var toProcessorQueueSettings = configuration.Bind<QueueSettings>("Queues:ToProcessor");
            var notificationsQueueSettings = configuration.Bind<QueueSettings>("Queues:NotificationsToSignalR");
            var messagesQueueSettings = configuration.Bind<QueueSettings>("Queues:MessagesToSignalR");
            services.AddTransient(sp => new ProcessorProducer(OwnConnectionFactory.GetConnectionFactory(configuration), toProcessorQueueSettings));
            services.AddTransient(sp => new NotificationsProducer(OwnConnectionFactory.GetConnectionFactory(configuration), notificationsQueueSettings));
            services.AddTransient(sp => new MessagesProducer(OwnConnectionFactory.GetConnectionFactory(configuration), messagesQueueSettings));
            
            services.AddHostedService<BuildStatusesQueueConsumerService>();
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
                ["quartz.dataSource.default.connectionString"] = configuration["ConnectionStrings:QuartzDBConnection"],
                ["quartz.plugin.timezoneConverter.type"] = "Quartz.Plugin.TimeZoneConverter.TimeZoneConverterPlugin, Quartz.Plugins.TimeZoneConverter"
            };

            var schedularFactory =  new StdSchedulerFactory(properties);

            return schedularFactory.GetScheduler().GetAwaiter().GetResult();
        }

        public static void AddElasticsearch(this IServiceCollection services, IConfiguration configuration)
        {
            var url = configuration["ElasticConfiguration:Uri"];
            var defaultIndex = "processes";

            var settings = new ConnectionSettings(new Uri(url))
                .DefaultIndex(defaultIndex)
                .DefaultMappingFor<ProjectLog>(m => m
                    .Ignore(p => p.Timestamp)
                    .PropertyName(p => p.ProjectId, "ProjectId")
                );

            var client = new ElasticClient(settings);

            services.AddSingleton<IElasticClient>(client);
        }
    }
}