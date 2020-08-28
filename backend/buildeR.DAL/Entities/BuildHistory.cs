using buildeR.Common.Enums;
using buildeR.DAL.Entities.Common;
using System;

namespace buildeR.DAL.Entities
{
    public class BuildHistory: Entity
    {
        public int ProjectId { get; set; }
        public int PerformerId { get; set; }
        public BuildStatus BuildStatus { get; set; }
        public int? Duration { get; set; }
        public DateTime? BuildAt { get; set; }
        public DateTime StartedAt { get; set; }
        public string BranchHash { get; set; }
        public string CommitHash { get; set; }
        public int Number { get; set; }

        public virtual User Performer { get; set; }
        public virtual Project Project { get; set; }
    }
}
