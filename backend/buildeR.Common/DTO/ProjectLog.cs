using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace buildeR.Common.DTO
{
    public class ProjectLog
    {
        public DateTime timestamp { get; set; }
        public string message { get; set; }
        public int buildId { get; set; }
        public int buildStep { get; set; }
    }
}
