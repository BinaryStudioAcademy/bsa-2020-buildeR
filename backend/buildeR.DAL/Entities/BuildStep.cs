using System;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public partial class BuildStep
    {
        public BuildStep()
        {
            BuildPluginParameters = new HashSet<BuildPluginParameters>();
        }

        public long Id { get; set; }
        public string BuildStepName { get; set; }
        public long BuildPluginId { get; set; }
        public long? LoggingVerbosity { get; set; }
        public long ProjectId { get; set; }

        public virtual BuildPlugin BuildPlugin { get; set; }
        public virtual Project Project { get; set; }
        public virtual ICollection<BuildPluginParameters> BuildPluginParameters { get; set; }
    }
}
