using System;
using Microsoft.Extensions.Configuration;

namespace buildeR.RabbitMq.Models
{
    public class ConnectionFactorySettings
    {
        private readonly IConfiguration _configuration;
        
        public ConnectionFactorySettings(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        
        public string HostName => _configuration["RABBIT_MQ_HOST_NAME"];
        public int Host { get; set; } = 5672;
        public string UserName => _configuration["RABBIT_MQ_USERNAME"];
        public string Password => _configuration["RABBIT_MQ_PASSWORD"];
        public string VirtualHost { get; set; } = "/";
        public TimeSpan ContinuationTimeout { get; set; } = new TimeSpan(10, 0, 0, 0);
    }
}
