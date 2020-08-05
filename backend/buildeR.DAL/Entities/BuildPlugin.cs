using System;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public partial class BuildPlugin
    {
        public BuildPlugin()
        {
            BuildStep = new HashSet<BuildStep>();
            PluginCommand = new HashSet<PluginCommand>();
        }

        public long Id { get; set; }
        public string PluginName { get; set; }
        public string Command { get; set; }

        public virtual ICollection<BuildStep> BuildStep { get; set; }
        public virtual ICollection<PluginCommand> PluginCommand { get; set; }
    }
}
