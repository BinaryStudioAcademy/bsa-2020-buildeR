using buildeR.DAL.Entities.Common;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public class Group: Entity
    {
        public Group()
        {
            ProjectGroup = new HashSet<ProjectGroup>();
            TeamMember = new HashSet<TeamMember>();
        }

        public bool IsPublic { get; set; }
        public string GroupName { get; set; }

        public virtual ICollection<ProjectGroup> ProjectGroup { get; set; }
        public virtual ICollection<TeamMember> TeamMember { get; set; }
    }
}
