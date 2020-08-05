using buildeR.DAL.Context.EntityConfigurations;
using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

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

        public static ICollection<User> GenerateRandomUsers(this ICollection<Team> teams)
        {
            int userId = 1;

            var usersFake = new Faker<User>()
                .RuleFor(u => u.Id, _ => userId++)
                .RuleFor(u => u.FirstName, f => f.Person.FirstName)
                .RuleFor(u => u.LastName, f => f.Person.LastName)
                .RuleFor(u => u.Email, f => f.Person.Email)
                .RuleFor(pi => pi.Birthday, f => f.Date.Between(new DateTime(1990, 1, 1), new DateTime(2010, 1, 1)))
                .RuleFor(pi => pi.RegisteredAt, _ => DateTime.Now)
                .RuleFor(pi => pi.TeamId, f => f.PickRandom(teams).Id);

            return usersFake.Generate(USERS_COUNT);
        }
    }
}
