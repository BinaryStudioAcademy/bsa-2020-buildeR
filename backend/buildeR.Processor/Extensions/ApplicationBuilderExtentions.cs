using buildeR.Processor.Services;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace buildeR.Processor.Extensions
{
    public static class ApplicationBuilderExtentions
    {
        private static ProcessorService Service { get; set; }

        public static IApplicationBuilder UseProcessorService(this IApplicationBuilder app)
        {
            Service = app.ApplicationServices.GetService<ProcessorService>();

            var lifetime = app.ApplicationServices.GetService<IApplicationLifetime>();

            lifetime.ApplicationStarted.Register(OnStarted);
            lifetime.ApplicationStopping.Register(OnStopping);

            return app;
        }

        private static void OnStarted()
        {
            Service.Register();
        }

        private static void OnStopping()
        {
            Service.Unregister();
        }
    }
}
