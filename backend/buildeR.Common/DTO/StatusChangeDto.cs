using System;
using buildeR.Common.Enums;

namespace buildeR.Common.DTO
{
    public class StatusChangeDto
    {
        public int BuildHistoryId { get; set; }
        public BuildStatus Status { get; set; }
        public DateTime Time { get; set; }
    }
}