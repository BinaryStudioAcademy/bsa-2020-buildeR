namespace buildeR.Common.DTO.ProjectTrigger
{
    public sealed class NewProjectTriggerDTO
    {
        public int ProjectId { get; set; }
        public int TriggerType { get; set; }
        public string BranchHash { get; set; }
        public string CronExpression { get; set; }
    }
}
