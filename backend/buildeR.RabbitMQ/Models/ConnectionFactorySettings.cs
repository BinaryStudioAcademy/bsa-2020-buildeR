using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.RabbitMq.Models
{
    public static class ConnectionFactorySettings
    {
        public static string HostName { get; set; } = Environment.GetEnvironmentVariable("RABBIT_MQ_HOST_NAME");
        public static int Host { get; set; } = 5672;
        public static string UserName { get; set; } = Environment.GetEnvironmentVariable("RABBIT_MQ_USERNAME");
        public static string Password { get; set; } = Environment.GetEnvironmentVariable("RABBIT_MQ_PASSWORD");
        public static string VirtualHost { get; set; } = "/";
        public static TimeSpan ContinuationTimeout { get; set; } = new TimeSpan(10, 0, 0, 0);
    }
}
