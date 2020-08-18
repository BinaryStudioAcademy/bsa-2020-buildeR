using System;

namespace buildeR.Common.DTO.Quartz
{
    public sealed class QuartzInfoDTO
    {
        public string Id { get; set; }
        public string Group { get; set; }
        public string Description { get; set; }
        public string CronExpression { get; set; }
        public DateTime? NextFireTime { get; set; }
        public DateTime? PreviousFireTime { get; set; }
    }
}
