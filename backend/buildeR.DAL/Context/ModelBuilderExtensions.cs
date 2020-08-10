using Bogus;
using buildeR.Common.Enums;
using buildeR.DAL.Context.EntityConfigurations;
using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace buildeR.DAL.Context
{
    public static class ModelBuilderExtensions
    {
        private const int BUILD_PLUGIN_COUNT = 20;
        private const int GROUP_COUNT = 30;
        private const int PLUGIN_COMMAND_COUNT = 100;
        private const int USER_COUNT = 200;
        private const int USER_SN_COUNT = 200;
        private const int PROJECT_COUNT = 100;
        private const int BUILD_HISTORY_COUNT = 100;
        private const int BUILD_STEP_COUNT = 100;
        private const int BUILD_PLUGIN_PARAMETER_COUNT = 100;
        private const int PROJECT_GROUP_COUNT = 50;
        private const int PROJECT_TRIGGER_COUNT = 50;
        private const int TEAM_MEMBER_COUNT = 50;
        private const int NOTIFICATION_COUNT = 100;

        public static void Configure(this ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(BuildHistoryConfig).Assembly);
        }
        public static void Seed(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(new User() //just for testing
            {
                Id = 1,
                Role = UserRole.Creator,
                Email = "buildeR@gmail.com",
                Username = "buildeR",
                AvatarUrl = null,
                FirstName = "Build",
                LastName = "R",
                Bio = ""
            });
            //var buildPlugins = GenerateRandomBuildPlugins();
            //var groups = GenerateRandomGroups();
            //var pluginCommands = GenerateRandomPluginCommands(buildPlugins);
            //var socialNetworks = GenerateSocialNetworks();
            //var users = GenerateRandomUsers();
            //var userSocialNetworks = GenerateRandomUserSocialNetworks(users, socialNetworks);
            //var projects = GenerateRandomProjects(users);
            //var buildHistories = GenerateRandomBuildHistories(users, projects);
            //var buildSteps = GenerateRandomBuildSteps(buildPlugins, projects);
            //var buildPluginParameters = GenerateRandomBuildPluginParameters(buildSteps);
            //var projectGroups = GenerateRandomProjectGroups(projects, groups);
            //var projectTriggers = GenerateRandomProjectTriggers(projects);
            //var teamMembers = GenerateRandomTeamMembers(groups, users);
            //var notifications = GenerateRandomNotifications();

            //modelBuilder.Entity<BuildPlugin>().HasData(buildPlugins);
            //modelBuilder.Entity<Group>().HasData(groups);
            //modelBuilder.Entity<PluginCommand>().HasData(pluginCommands);
            //modelBuilder.Entity<SocialNetwork>().HasData(socialNetworks);
            //modelBuilder.Entity<User>().HasData(users);
            //modelBuilder.Entity<UserSocialNetwork>().HasData(userSocialNetworks);
            //modelBuilder.Entity<Project>().HasData(projects);
            //modelBuilder.Entity<BuildHistory>().HasData(buildHistories);
            //modelBuilder.Entity<BuildStep>().HasData(buildSteps);
            //modelBuilder.Entity<BuildPluginParameter>().HasData(buildPluginParameters);
            //modelBuilder.Entity<ProjectGroup>().HasData(projectGroups);
            //modelBuilder.Entity<ProjectTrigger>().HasData(projectTriggers);
            //modelBuilder.Entity<TeamMember>().HasData(teamMembers);
            //modelBuilder.Entity<Notification>().HasData(notifications);
        }

        public static ICollection<BuildPlugin> GenerateRandomBuildPlugins()
        {
            int buildPluginId = 1;

            var buildPluginFake = new Faker<BuildPlugin>()
                .RuleFor(bp => bp.Id, _ => buildPluginId++)
                .RuleFor(bp => bp.PluginName, f => f.Lorem.Word())
                .RuleFor(bp => bp.Command, f => f.Lorem.Sentence());

            return buildPluginFake.Generate(BUILD_PLUGIN_COUNT);
        }

        public static ICollection<Group> GenerateRandomGroups()
        {
            int groupId = 1;

            var groupFake = new Faker<Group>()
                .RuleFor(g => g.Id, _ => groupId++)
                .RuleFor(g => g.IsPublic, f => f.Random.Bool())
                .RuleFor(g => g.Name, f => f.Lorem.Word());

            return groupFake.Generate(GROUP_COUNT);
        }

        public static ICollection<PluginCommand> GenerateRandomPluginCommands(this ICollection<BuildPlugin> buildPlugins)
        {
            int pluginCommandId = 1;

            var pluginCommandFake = new Faker<PluginCommand>()
                .RuleFor(pc => pc.Id, _ => pluginCommandId++)
                .RuleFor(pc => pc.Name, f => f.Lorem.Word())
                .RuleFor(pc => pc.PluginId, f => f.PickRandom(buildPlugins).Id);

            return pluginCommandFake.Generate(PLUGIN_COMMAND_COUNT);
        }

        public static ICollection<SocialNetwork> GenerateSocialNetworks()
        {
            return new List<SocialNetwork>()
            {
                new SocialNetwork { Id = 1, ProviderName = Provider.GitHub },
                new SocialNetwork { Id = 2, ProviderName = Provider.Bitbucket }
            };
        }

        public static ICollection<User> GenerateRandomUsers()
        {
            int userId = 1;

            var userFake = new Faker<User>()
                .RuleFor(u => u.Id, _ => userId++)
                .RuleFor(u => u.Role, f => f.PickRandom<UserRole>())
                .RuleFor(u => u.Email, f => f.Person.Email)
                .RuleFor(u => u.Username, f => f.Person.UserName)
                .RuleFor(u => u.AvatarUrl, f => f.Internet.Url())
                .RuleFor(u => u.FirstName, f => f.Person.FirstName)
                .RuleFor(u => u.LastName, f => f.Person.LastName)
                .RuleFor(u => u.Bio, f => f.Lorem.Text());

            return userFake.Generate(USER_COUNT);
        }

        public static ICollection<UserSocialNetwork> GenerateRandomUserSocialNetworks(this ICollection<User> users, ICollection<SocialNetwork> socialNetworks)
        {
            int userSNId = 1;

            var userSNFake = new Faker<UserSocialNetwork>()
                .RuleFor(usn => usn.Id, _ => userSNId++)
                .RuleFor(usn => usn.UserId, f => f.PickRandom(users).Id)
                .RuleFor(usn => usn.SocialNetworkId, f => f.PickRandom(socialNetworks).Id)
                .RuleFor(usn => usn.SocialNetworkUrl, f => f.Internet.Url());

            return userSNFake.Generate(USER_SN_COUNT);
        }

        public static ICollection<Project> GenerateRandomProjects(this ICollection<User> users)
        {
            int projectId = 1;

            var projectFake = new Faker<Project>()
                .RuleFor(p => p.Id, _ => projectId++)
                .RuleFor(p => p.OwnerId, f => f.PickRandom(users).Id)
                .RuleFor(p => p.Name, f => f.Commerce.ProductName())
                .RuleFor(p => p.Description, f => f.Lorem.Text())
                .RuleFor(p => p.IsPublic, f => f.Random.Bool())
                .RuleFor(p => p.RepositoryUrl, f => f.Internet.Url())
                .RuleFor(p => p.CredentialsId, f => f.Lorem.Sentence())
                .RuleFor(p => p.IsAutoCancelBranchBuilds, true)
                .RuleFor(p => p.IsAutoCancelPullRequestBuilds, true)
                .RuleFor(p => p.IsCleanUpBeforeBuild, true)
                .RuleFor(p => p.CancelAfter, 3000);
            return projectFake.Generate(PROJECT_COUNT);
        }

        public static ICollection<BuildHistory> GenerateRandomBuildHistories(this ICollection<User> users, ICollection<Project> projects)
        {
            int buildHistoryId = 1;

            var buildHistoryFake = new Faker<BuildHistory>()
                .RuleFor(bh => bh.Id, _ => buildHistoryId++)
                .RuleFor(bh => bh.PerformerId, f => f.PickRandom(users).Id)
                .RuleFor(bh => bh.ProjectId, f => f.PickRandom(projects).Id)
                .RuleFor(bh => bh.BuildStatus, f => f.PickRandom<BuildStatus>())
                .RuleFor(bh => bh.Duration, f => (int)f.Random.UInt())
                .RuleFor(bh => bh.BuildAt, DateTime.Now)
                .RuleFor(bh => bh.BranchHash, f => f.Lorem.Sentence())
                .RuleFor(bh => bh.CommitHash, f => f.Lorem.Sentence());

            return buildHistoryFake.Generate(BUILD_HISTORY_COUNT);
        }

        public static ICollection<BuildStep> GenerateRandomBuildSteps(this ICollection<BuildPlugin> buildPlugins, ICollection<Project> projects)
        {
            int buildStepId = 1;

            var buildStepFake = new Faker<BuildStep>()
                .RuleFor(bs => bs.Id, _ => buildStepId++)
                .RuleFor(bs => bs.BuildStepName, f => f.Lorem.Word())
                .RuleFor(bs => bs.BuildPluginId, f => f.PickRandom(buildPlugins).Id)
                .RuleFor(bs => bs.ProjectId, f => f.PickRandom(projects).Id)
                .RuleFor(usn => usn.LoggingVerbosity, f => f.PickRandom<LoggingVerbosity>());

            return buildStepFake.Generate(BUILD_STEP_COUNT);
        }

        public static ICollection<BuildPluginParameter> GenerateRandomBuildPluginParameters(this ICollection<BuildStep> buildSteps)
        {
            int buildPPId = 1;

            var buildPPFake = new Faker<BuildPluginParameter>()
                .RuleFor(bpp => bpp.Id, _ => buildPPId++)
                .RuleFor(bpp => bpp.Key, f => f.Lorem.Word())
                .RuleFor(bpp => bpp.Value, f => f.Lorem.Word())
                .RuleFor(bpp => bpp.BuildStepId, f => f.PickRandom(buildSteps).Id);

            return buildPPFake.Generate(BUILD_PLUGIN_PARAMETER_COUNT);
        }

        public static ICollection<ProjectGroup> GenerateRandomProjectGroups(this ICollection<Project> projects, ICollection<Group> groups)
        {
            int pgId = 1;

            var pgFake = new Faker<ProjectGroup>()
                .RuleFor(pg => pg.Id, _ => pgId++)
                .RuleFor(pg => pg.GroupId, f => f.PickRandom(groups).Id)
                .RuleFor(pg => pg.ProjectId, f => f.PickRandom(projects).Id);

            return pgFake.Generate(PROJECT_GROUP_COUNT);
        }

        public static ICollection<ProjectTrigger> GenerateRandomProjectTriggers(this ICollection<Project> projects)
        {
            int ptId = 1;

            var ptFake = new Faker<ProjectTrigger>()
                .RuleFor(pt => pt.Id, _ => ptId++)
                .RuleFor(pt => pt.TriggerType, f => f.PickRandom<TriggerType>())
                .RuleFor(pt => pt.BranchHash, f => f.Lorem.Sentence())
                .RuleFor(pt => pt.ProjectId, f => f.PickRandom(projects).Id);

            return ptFake.Generate(PROJECT_TRIGGER_COUNT);
        }

        public static ICollection<TeamMember> GenerateRandomTeamMembers(this ICollection<Group> groups, ICollection<User> users)
        {
            int teamMemberId = 1;

            var teamMemberFake = new Faker<TeamMember>()
                .RuleFor(tm => tm.Id, _ => teamMemberId++)
                .RuleFor(tm => tm.MemberRole, f => f.PickRandom<UserRole>())
                .RuleFor(tm => tm.GroupId, f => f.PickRandom(groups).Id)
                .RuleFor(tm => tm.UserId, f => f.PickRandom(users).Id);

            return teamMemberFake.Generate(TEAM_MEMBER_COUNT);
        }

        public static ICollection<Notification> GenerateRandomNotifications()
        {
            int notificationId = 1;

            var notificationFake = new Faker<Notification>()
                .RuleFor(n => n.Id, _ => notificationId++)
                .RuleFor(n => n.EntityType, f => f.PickRandom<EntityType>())
                .RuleFor(n => n.NotificationTrigger, f => f.PickRandom<NotificationTrigger>())
                .RuleFor(n => n.NotificationMessage, f => f.Lorem.Sentence())
                .RuleFor(tm => tm.EntityId, f => f.Random.Int(1, GROUP_COUNT));

            return notificationFake.Generate(NOTIFICATION_COUNT);
        }
    }
}
