using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.Common.DTO.BuildStep
{
    public class PostBuildStepConfig
    {
        public string Host { get; set; }
        public string User { get; set; }
        public string Password { get; set; }
        public string OutputDirectory { get; set; }
    }
}
