using buildeR.Common.Enums;
using buildeR.DAL.Entities.Common;

using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public class BuildStep : Entity
    {
        public BuildStep()
        {
            BuildPluginParameters = new HashSet<BuildPluginParameter>();
        }

        public int Index { get; set; }
        public string BuildStepName { get; set; }
        public int PluginCommandId { get; set; }
        public string WorkDirectory { get; set; }
        public LoggingVerbosity LoggingVerbosity { get; set; }
        public int ProjectId { get; set; }
        public string DockerImageVersion { get; set; }

        public virtual PluginCommand PluginCommand { get; set; }
        public virtual Project Project { get; set; }
        public virtual IEnumerable<CommandArgument> CommandArguments { get; set; }
        public virtual ICollection<BuildPluginParameter> BuildPluginParameters { get; set; }
    }
}
