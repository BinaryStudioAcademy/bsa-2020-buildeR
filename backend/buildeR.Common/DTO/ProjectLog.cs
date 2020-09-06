using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace buildeR.Common.DTO
{
    public class ProjectLog
    {
        public DateTime Timestamp { get; set; }
        public string Message { get; set; }
        public int BuildHistoryId { get; set; }
        public int ProjectId { get; set; }
    }
}
