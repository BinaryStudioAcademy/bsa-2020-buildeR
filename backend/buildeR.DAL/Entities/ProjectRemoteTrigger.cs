using buildeR.Common.Enums;
using buildeR.DAL.Entities.Common;

namespace buildeR.DAL.Entities
{
    public class ProjectRemoteTrigger:Entity
    {
        public RemoteTriggerType Type { get; set; }
        public string Branch { get; set; }
        public int ProjectId { get; set; }
        public Project Project { get; set; }
    }
}
