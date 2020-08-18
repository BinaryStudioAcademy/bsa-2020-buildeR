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
        public int BuildId { get; set; }
        public int BuildStep { get; set; }
    }
}
