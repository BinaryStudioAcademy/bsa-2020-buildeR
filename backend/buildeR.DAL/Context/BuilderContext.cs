using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace buildeR.DAL.Context
{
    public class BuilderContext : DbContext
    {
        public DbSet<BuildHistory> BuildHistories { get; private set; }
        public DbSet<BuildPlugin> BuildPlugins { get; private set; }
        public DbSet<BuildPluginParameter> BuildPluginParamemeters { get; private set; }
        public DbSet<BuildStep> BuildSteps { get; private set; }
        public DbSet<Group> Groups { get; private set; }
        public DbSet<Notification> Notifications { get; private set; }
        public DbSet<PluginCommand> PluginCommands { get; private set; }
        public DbSet<Project> Projects { get; private set; }
        public DbSet<ProjectGroup> ProjectGroups { get; private set; }
        public DbSet<ProjectTrigger> ProjectTriggers { get; private set; }
        public DbSet<TeamMember> TeamMembers { get; private set; }
        public DbSet<User> Users { get; private set; }
        public DbSet<UserSocialNetwork> UserSocialNetworks { get; private set; }
        public DbSet<UserLetter> UserLetters { get; private set; }
        public DbSet<NotificationSetting> NotificationSettings { get; private set; }

        public BuilderContext(DbContextOptions<BuilderContext> options) : base(options) {}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {   
            modelBuilder.Configure();
            modelBuilder.Seed();
        }
    }
}