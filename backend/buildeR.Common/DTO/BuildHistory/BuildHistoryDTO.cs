using buildeR.Common.DTO.Project;
using buildeR.Common.DTO.User;

using System;

namespace buildeR.Common.DTO.BuildHistory
{
    public sealed class BuildHistoryDTO
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public int PerformerId { get; set; }
        public int BuildStatus { get; set; }
        public int Duration { get; set; }
        public DateTime BuildAt { get; set; }
        public string BranchHash { get; set; }
        public string CommitHash { get; set; }
        public int Number { get; set; }
        public UserDTO Performer { get; set; }
        public ProjectDTO Project { get; set; }
    }
}
