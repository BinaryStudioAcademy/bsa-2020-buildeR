using buildeR.DAL.Entities.Common;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public class Group: Entity
    {
        public Group()
        {
            ProjectGroups = new HashSet<ProjectGroup>();
            TeamMembers = new HashSet<TeamMember>();
        }

        public bool IsPublic { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public virtual ICollection<ProjectGroup> ProjectGroups { get; set; }
        public virtual ICollection<TeamMember> TeamMembers { get; set; }
    }
}
