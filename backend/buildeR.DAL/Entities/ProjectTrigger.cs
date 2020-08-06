using buildeR.DAL.Entities.Common;
using buildeR.DAL.Enums;

namespace buildeR.DAL.Entities
{
    public class ProjectTrigger: Entity
    {
        public int ProjectId { get; set; }
        public TriggerType TriggerType { get; set; }
        public string BranchHash { get; set; }

        public virtual Project Project { get; set; }
    }
}
