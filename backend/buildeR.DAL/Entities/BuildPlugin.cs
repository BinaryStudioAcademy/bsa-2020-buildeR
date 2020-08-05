using buildeR.DAL.Entities.Common;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public class BuildPlugin: Entity
    {
        public BuildPlugin()
        {
            BuildSteps = new HashSet<BuildStep>();
            PluginCommands = new HashSet<PluginCommand>();
        }

        public string PluginName { get; set; }
        public string Command { get; set; }

        public virtual ICollection<BuildStep> BuildSteps { get; set; }
        public virtual ICollection<PluginCommand> PluginCommands { get; set; }
    }
}
