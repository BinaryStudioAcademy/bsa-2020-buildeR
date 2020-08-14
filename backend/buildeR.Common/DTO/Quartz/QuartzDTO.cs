using Newtonsoft.Json;
using System;

namespace buildeR.Common.DTO.Quartz
{
    public class QuartzDTO
    {
        [JsonIgnoreAttribute]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Group { get; set; }
        public string Description { get; set; }
        public string CronExpression { get; set; }
    }
}
