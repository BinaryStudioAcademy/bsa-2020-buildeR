using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace buildeR.Processor.Services
{
    public class ProjectLog
    {
        public DateTime timestamp;
        public string message;
        public int buildId;
        public int buildStep;
    }
}
