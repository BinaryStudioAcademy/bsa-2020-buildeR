using buildeR.API.Extensions;
using buildeR.API.Middleware;
using buildeR.Common.FluentValidators.User;
using buildeR.DAL.Context;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Swagger;

namespace buildeR
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostEnvironment hostingEnvironment)
        {
            Configuration = new ConfigurationBuilder()
                .SetBasePath(hostingEnvironment.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{hostingEnvironment.EnvironmentName}.json", reloadOnChange: true, optional: true)
                .AddEnvironmentVariables()
                .Build();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            IdentityModelEventSource.ShowPII = true;

            services
                .AddControllers()
                .AddFluentValidation(fv =>
                    fv.RegisterValidatorsFromAssemblyContaining<UserDtoValidator>());

            var migrationAssembly = typeof(BuilderContext).Assembly.GetName().Name;
            services.AddDbContext<BuilderContext>(options =>
                options.UseSqlServer(Configuration["ConnectionStrings:BuilderDBConnection"], opt => opt.MigrationsAssembly(migrationAssembly)));

            var migrationAssemblyForQuartzDB = typeof(QuartzDBContext).Assembly.GetName().Name;
            services.AddDbContext<QuartzDBContext>(options =>
                options.UseSqlServer(Configuration["ConnectionStrings:QuartzDBConnection"], opt => opt.MigrationsAssembly(migrationAssemblyForQuartzDB)));
            
            services.AddHealthChecks();

            services.RegisterCustomServices(Configuration);
            services.RegisterRabbitMQ(Configuration);
            services.RegisterHttpCients();

            services.AddCors(options =>
            {
                options.AddPolicy("AnyOrigin", x => x
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader());
            });

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    var firebaseProjectName = Configuration["FirebaseProjectName"];
                    options.Authority = "https://securetoken.google.com/" + firebaseProjectName;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = "https://securetoken.google.com/" + firebaseProjectName,
                        ValidateAudience = true,
                        ValidAudience = firebaseProjectName,
                        ValidateLifetime = true
                    };
                });

            services.AddSwaggerGen(o =>
            {
                o.SwaggerDoc("v1", new OpenApiInfo { Title = "builder API", Version = "v1" });
                o.AddFluentValidationRules();
                o.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.Http,
                    Scheme = JwtBearerDefaults.AuthenticationScheme,
                    BearerFormat = "JWT",
                    Description = "JWT Authorization header using the Bearer scheme.",
                    In = ParameterLocation.Header
                });
                o.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = JwtBearerDefaults.AuthenticationScheme,
                            }
                        },
                        new string[] {}
                    }
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors("AnyOrigin");

            app.UseMiddleware<GenericExceptionHandlerMiddleware>();

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });

            app.UseHttpsRedirection();

            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseSwagger();
            app.UseSwaggerUI(o => o.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1"));

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHealthChecks("/health");
            });

            InitializeDatabase(app);
        }

        private void InitializeDatabase(IApplicationBuilder app)
        {
            using (var scope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                using var context = scope.ServiceProvider.GetRequiredService<BuilderContext>();
                context.Database.Migrate();

                using var contextQuartz = scope.ServiceProvider.GetRequiredService<QuartzDBContext>();
                contextQuartz.Database.Migrate();
            };
        }
    }
}