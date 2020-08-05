using buildeR.DAL.Entities.Common;
using buildeR.DAL.Enums;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public class Project: Entity
    {
        public Project()
        {
            BuildHistory = new HashSet<BuildHistory>();
            BuildStep = new HashSet<BuildStep>();
            ProjectGroup = new HashSet<ProjectGroup>();
            ProjectTrigger = new HashSet<ProjectTrigger>();
        }

        public int OwnerId { get; set; }
        public string ProjectName { get; set; }
        public string ProjectDescription { get; set; }
        public bool IsPublic { get; set; }
        public string RepositoryUrl { get; set; }
        public string CredentialId { get; set; }
        public bool IsAutoCancelBranchBuilds { get; set; }
        public bool IsAutoCancelPullRequestBuilds { get; set; }
        public bool IsCleanUpBeforeBuild { get; set; }
        public int? CancelAfter { get; set; }

        public virtual User Owner { get; set; }
        public virtual ICollection<BuildHistory> BuildHistory { get; set; }
        public virtual ICollection<BuildStep> BuildStep { get; set; }
        public virtual ICollection<ProjectGroup> ProjectGroup { get; set; }
        public virtual ICollection<ProjectTrigger> ProjectTrigger { get; set; }
    }
}
