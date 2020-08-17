using System;

namespace buildeR.Common.DTO.ProjectTrigger
{
    public sealed class ProjectTriggerInfoDTO
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string BranchHash { get; set; }
        public string CronExpression { get; set; }
        public DateTime? NextFireTime { get; set; }
        public DateTime? PreviousFireTime { get; set; }
    }
}
