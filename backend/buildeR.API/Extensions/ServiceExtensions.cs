using buildeR.BLL.Interfaces;
using buildeR.BLL.Services;
using buildeR.BLL.Services.Abstract;

using buildeR.Common.DTO.User;
using buildeR.DAL.Entities;

using Microsoft.Extensions.DependencyInjection;

namespace buildeR.API.Extensions
{
    public static class ServiceExtensions
    {
        public static void RegisterCustomServices(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>();

            services.AddScoped<IProjectService, ProjectService>();
        }
    }
}