using System;

namespace buildeR.Common.DTO.Quartz
{
    public class QuartzInfoDTO
    {
        public string Id { get; set; }
        public string Group { get; set; }
        public string Description { get; set; }
        public string CronExpression { get; set; }
        public string TriggerType { get; set; }
        public DateTimeOffset? NextFireTime { get; set; }
        public DateTimeOffset? PreviousFireTime { get; set; }
    }
}
