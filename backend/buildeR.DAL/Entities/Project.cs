using buildeR.DAL.Entities.Common;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public class Project: Entity
    {
        public Project()
        {
            BuildHistories = new HashSet<BuildHistory>();
            BuildSteps = new HashSet<BuildStep>();
            ProjectGroups = new HashSet<ProjectGroup>();
            ProjectTriggers = new HashSet<ProjectTrigger>();
        }

        public int OwnerId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsPublic { get; set; }
        public string Repository { get; set; }
        public string CredentialsId { get; set; }
        public bool IsAutoCancelBranchBuilds { get; set; }
        public bool IsAutoCancelPullRequestBuilds { get; set; }
        public bool IsCleanUpBeforeBuild { get; set; }
        public bool IsFavorite { get; set; }
        public int? CancelAfter { get; set; }

        public virtual User Owner { get; set; }
        public virtual Repository _Repository { get; set; }
        public virtual ICollection<BuildHistory> BuildHistories { get; set; }
        public virtual ICollection<BuildStep> BuildSteps { get; set; }
        public virtual ICollection<ProjectGroup> ProjectGroups { get; set; }
        public virtual ICollection<ProjectTrigger> ProjectTriggers { get; set; }
    }
}
