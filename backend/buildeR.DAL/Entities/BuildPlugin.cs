using buildeR.DAL.Entities.Common;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public class BuildPlugin: Entity
    {
        public BuildPlugin()
        {
            BuildStep = new HashSet<BuildStep>();
            PluginCommand = new HashSet<PluginCommand>();
        }

        public string PluginName { get; set; }
        public string Command { get; set; }

        public virtual ICollection<BuildStep> BuildStep { get; set; }
        public virtual ICollection<PluginCommand> PluginCommand { get; set; }
    }
}
