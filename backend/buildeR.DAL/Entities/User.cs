using buildeR.Common.Enums;
using buildeR.DAL.Entities.Common;
using System;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public class User: AuditEntity
    {
        public User()
        {
            BuildHistories = new HashSet<BuildHistory>();
            Projects = new HashSet<Project>();
            TeamMembers = new HashSet<TeamMember>();
            UserSocialNetworks = new HashSet<UserSocialNetwork>();
            Notifications = new HashSet<Notification>();
        }

        public UserRole Role { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string AvatarUrl { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Bio { get; set; }
        public NotificationSetting NotificationSetting { get; set; }

        public virtual ICollection<BuildHistory> BuildHistories { get; set; }
        public virtual ICollection<Project> Projects { get; set; }
        public virtual ICollection<TeamMember> TeamMembers { get; set; }
        public virtual ICollection<UserSocialNetwork> UserSocialNetworks { get; set; }
        public virtual ICollection<Notification> Notifications { get; set; }
    }
}
