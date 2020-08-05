using buildeR.DAL.Context.EntityConfigurations;
using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace buildeR.DAL.Context
{
    public static class ModelBuilderExtensions
    {
        public static void Configure(this ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(BuildHistoryConfig).Assembly);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(BuildPluginParameterConfig).Assembly);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(BuildStepConfig).Assembly);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(PluginCommandConfig).Assembly);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ProjectConfig).Assembly);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ProjectGroupConfig).Assembly);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ProjectTriggerConfig).Assembly);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(TeamMemberConfig).Assembly);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(UserSocialNetworkConfig).Assembly);
        }   
        public static void Seed(this ModelBuilder modelBuilder)
        {
         
        }
    }
}
