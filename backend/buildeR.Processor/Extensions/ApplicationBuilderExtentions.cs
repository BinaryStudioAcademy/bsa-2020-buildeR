//using buildeR.Processor.Services;

//using Microsoft.AspNetCore.Builder;
//using Microsoft.Extensions.DependencyInjection;
//using Microsoft.Extensions.Hosting;

//namespace buildeR.Processor.Extensions
//{
//    public static class ApplicationBuilderExtentions
//    {
//        private static ProcessorService Service { get; set; }

//        public static IApplicationBuilder UseProcessorService(this IApplicationBuilder app)
//        {
//            Service = app.ApplicationServices.GetService<ProcessorService>();

//            var lifetime = app.ApplicationServices.GetService<IHostApplicationLifetime>();

//            lifetime.ApplicationStarted.Register(OnStarted);
//            lifetime.ApplicationStopping.Register(OnStopping);

//            return app;
//        }

//        private static void OnStarted()
//        {
//            Service.Register();
//        }

//        private static void OnStopping()
//        {
//            Service.Unregister();
//        }
//    }
//}
