using System;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public partial class BuildHistory
    {
        public long Id { get; set; }
        public long ProjectId { get; set; }
        public long PerformerId { get; set; }
        public int BuildStatus { get; set; }
        public byte[] Duration { get; set; }
        public DateTime BuildAt { get; set; }
        public string BranchHash { get; set; }
        public string CommitHash { get; set; }

        public virtual User Performer { get; set; }
        public virtual Project Project { get; set; }
    }
}
