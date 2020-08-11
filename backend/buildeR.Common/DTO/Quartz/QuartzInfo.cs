using System;

namespace buildeR.Common.DTO.Quartz
{
    public class QuartzInfo
    {
        public string Group { get; set; }
        public string JobKeyName { get; set; }
        public string DetailDescription { get; set; }
        public string TriggerKeyName { get; set; }
        public string TriggerKeyGroup { get; set; }
        public string TriggerType { get; set; }
        public string TriggerState { get; set; }
        public DateTimeOffset? NextFireTime { get; set; }
        public DateTimeOffset? PreviousFireTime { get; set; }
    }
}
