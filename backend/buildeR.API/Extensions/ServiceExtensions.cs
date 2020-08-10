using AutoMapper;
using buildeR.BLL.Interfaces;
using buildeR.BLL.Interfaces.Uploads;
using buildeR.BLL.MappingProfiles;
using buildeR.BLL.Services;
using buildeR.BLL.Services.Abstract;
using buildeR.BLL.Services.Uploads;
using buildeR.Common.DTO.User;
using buildeR.DAL.Entities;

using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace buildeR.API.Extensions
{
    public static class ServiceExtensions
    {
        public static void RegisterCustomServices(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IProjectService, ProjectService>();
            services.AddScoped<IFileStorage, FileStorage>();

            services.RegisterAutoMapper();

        }
        public static void RegisterAutoMapper(this IServiceCollection services)
        {
            services.AddAutoMapper(cfg =>
            {
                cfg.AddProfile<UserProfile>();
                cfg.AddProfile<ProjectProfile>();
            },
            Assembly.GetExecutingAssembly());
        }
    }
}