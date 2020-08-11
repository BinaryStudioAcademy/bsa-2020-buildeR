using Microsoft.Extensions.Configuration;

namespace buildeR.Processor.Extensions
{
    public static class ConfigurationExtensions
    {
        public static T Bind<T>(this IConfiguration configuration, string key)
            where T : class, new()
        {
            var objectToBind = new T();
            configuration.Bind(key, objectToBind);
            return objectToBind;
        }
    }
}
