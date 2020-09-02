using buildeR.Common.DTO.BuildStep;

using System.Collections.Generic;

namespace buildeR.Common.DTO.BuildHistory
{
    public sealed class ExecutiveBuildDTO
    {
        public int BuildHistoryId { get; set; }
        public int ProjectId { get; set; }
        public string RepositoryUrl { get; set; }
        public IEnumerable<BuildStepDTO> BuildSteps { get; set; }
        public int UserId { get; set; }
    }
}
