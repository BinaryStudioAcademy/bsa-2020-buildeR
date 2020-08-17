using buildeR.Common.DTO.Project;

namespace buildeR.Common.DTO.ProjectTrigger
{
    public sealed class ProjectTriggerDTO
    {
        public int ProjectId { get; set; }
        public int Id { get; set; }
        public int TriggerType { get; set; }
        public string BranchHash { get; set; }
        public string CronExpression { get; set; }
        public ProjectDTO Project { get; set; }
    }
}
