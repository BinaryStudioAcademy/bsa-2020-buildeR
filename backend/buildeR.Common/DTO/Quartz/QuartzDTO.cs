namespace buildeR.Common.DTO.Quartz
{
    public sealed class QuartzDTO
    {
        public string Id { get; set; } 
        public string Group { get; set; }
        public string Description { get; set; }
        public string CronExpression { get; set; }
    }
}
