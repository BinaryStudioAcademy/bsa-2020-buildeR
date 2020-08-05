using System;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public partial class ProjectTrigger
    {
        public long ProjectId { get; set; }
        public long Id { get; set; }
        public int TriggerType { get; set; }
        public string BranchHash { get; set; }

        public virtual Project Project { get; set; }
    }
}
