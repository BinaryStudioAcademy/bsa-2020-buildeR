using buildeR.DAL.Entities.Common;
using buildeR.DAL.Enums;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public class BuildStep: Entity
    {
        public BuildStep()
        {
            BuildPluginParameters = new HashSet<BuildPluginParameter>();
        }

        public string BuildStepName { get; set; }
        public int BuildPluginId { get; set; }
        public LoggingVerbosity LoggingVerbosity { get; set; }
        public int ProjectId { get; set; }

        public virtual BuildPlugin BuildPlugin { get; set; }
        public virtual Project Project { get; set; }
        public virtual ICollection<BuildPluginParameter> BuildPluginParameters { get; set; }
    }
}
