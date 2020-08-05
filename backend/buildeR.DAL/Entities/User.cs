using buildeR.DAL.Entities.Common;
using System;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public class User: Entity
    {
        public User()
        {
            BuildHistory = new HashSet<BuildHistory>();
            Project = new HashSet<Project>();
            TeamMember = new HashSet<TeamMember>();
            UserSocialNetwork = new HashSet<UserSocialNetwork>();
        }

        public string UserRole { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string AvatarUrl { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Bio { get; set; }

        public virtual ICollection<BuildHistory> BuildHistory { get; set; }
        public virtual ICollection<Project> Project { get; set; }
        public virtual ICollection<TeamMember> TeamMember { get; set; }
        public virtual ICollection<UserSocialNetwork> UserSocialNetwork { get; set; }
    }
}
