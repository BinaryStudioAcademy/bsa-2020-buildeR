using buildeR.Processor.Services;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace buildeR.Processor.Extensions
{
    public static class ApplicationBuilderExtentions
    {
        private static ProcessorService _service { get; set; }

        public static IApplicationBuilder UseProcessorService(this IApplicationBuilder app)
        {
            _service = app.ApplicationServices.GetService<ProcessorService>();

            var lifetime = app.ApplicationServices.GetService<IApplicationLifetime>();

            lifetime.ApplicationStarted.Register(OnStarted);
            lifetime.ApplicationStopping.Register(OnStopping);

            return app;
        }

        private static void OnStarted()
        {
            _service.Register();
        }

        private static void OnStopping()
        {
            _service.Deregister();
        }
    }
}
