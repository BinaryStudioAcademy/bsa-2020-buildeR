using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace buildeR.DAL.Context
{
    public class BuilderContext : DbContext
    {
        public DbSet<BuildHistory> BuildHistories { get; }
        public DbSet<BuildPlugin> BuildPlugins { get; }
        public DbSet<BuildPluginParameter> BuildPluginParamemeters { get; }
        public DbSet<BuildStep> BuildSteps { get; }
        public DbSet<Group> Groups { get; }
        public DbSet<Notification> Notifications { get; }
        public DbSet<PluginCommand> PluginCommands { get; }
        public DbSet<Project> Projects { get; }
        public DbSet<ProjectGroup> ProjectGroups { get; }
        public DbSet<ProjectTrigger> ProjectTriggers { get; }
        public DbSet<SocialNetwork> SocialNetworks { get; }
        public DbSet<TeamMember> TeamMembers { get; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserSocialNetwork> UserSocialNetworks { get; }
        public BuilderContext(DbContextOptions options) : base(options) {}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Configure();
            modelBuilder.Seed();
        }
    }
}