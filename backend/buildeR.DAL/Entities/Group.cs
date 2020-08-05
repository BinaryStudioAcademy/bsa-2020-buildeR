using System;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public partial class Group
    {
        public Group()
        {
            ProjectGroup = new HashSet<ProjectGroup>();
            TeamMember = new HashSet<TeamMember>();
        }

        public long Id { get; set; }
        public bool? IsPublic { get; set; }
        public string GroupName { get; set; }

        public virtual ICollection<ProjectGroup> ProjectGroup { get; set; }
        public virtual ICollection<TeamMember> TeamMember { get; set; }
    }
}
