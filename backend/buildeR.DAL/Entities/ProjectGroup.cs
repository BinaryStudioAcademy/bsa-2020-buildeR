using buildeR.DAL.Entities.Common;

namespace buildeR.DAL.Entities
{
    public class ProjectGroup: Entity
    {
        public int GroupId { get; set; }
        public int ProjectId { get; set; }

        public virtual Group Group { get; set; }
        public virtual Project Project { get; set; }
    }
}
