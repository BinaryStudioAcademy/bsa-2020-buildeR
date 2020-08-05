using System;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public partial class BuildPluginParameters
    {
        public long Id { get; set; }
        public long BuildStepId { get; set; }
        public string ParameterValue { get; set; }
        public string ParameterKey { get; set; }

        public virtual BuildStep BuildStep { get; set; }
    }
}
