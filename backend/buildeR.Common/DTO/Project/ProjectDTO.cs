using buildeR.Common.DTO.BuildHistory;
using buildeR.Common.DTO.BuildStep;
using buildeR.Common.DTO.ProjectTrigger;
using buildeR.Common.DTO.Repository;
using buildeR.Common.DTO.User;

using System.Collections.Generic;

namespace buildeR.Common.DTO.Project
{
    public sealed class ProjectDTO
    {
        public int Id { get; set; }
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

        public UserDTO Owner { get; set; }
        public RepositoryDTO _Repository { get; set; }

        public ICollection<BuildHistoryDTO> BuildHistories { get; set; }
        public ICollection<BuildStepDTO> BuildSteps { get; set; }
        public ICollection<ProjectTriggerDTO> ProjectTriggers { get; set; }
    }
}
