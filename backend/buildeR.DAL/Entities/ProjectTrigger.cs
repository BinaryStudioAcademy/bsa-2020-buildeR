using buildeR.Common.Enums;
using buildeR.DAL.Entities.Common;

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
