using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace buildeR.RabbitMq.Models
{
    public class ConnectionFactorySettings
    {
        // private readonly IConfiguration _configuration;
        private readonly IConfigurationSection _section;
        
        public ConnectionFactorySettings(IConfiguration configuration)
        {
            _section = configuration.GetSection("RabbitMQ:ConnectionSettings");
        }
        
        public string HostName => _section["RABBIT_MQ_HOST_NAME"];
        public int Host { get; set; } = 5672;
        public string UserName => _section["RABBIT_MQ_USERNAME"];
        public string Password => _section["RABBIT_MQ_PASSWORD"];
        public string VirtualHost { get; set; } = "/";
        public TimeSpan ContinuationTimeout { get; set; } = new TimeSpan(10, 0, 0, 0);
    }
}
