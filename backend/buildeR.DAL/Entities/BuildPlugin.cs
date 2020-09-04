using buildeR.DAL.Entities.Common;

using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public class BuildPlugin : Entity
    {
        public string PluginName { get; set; }
        public string Command { get; set; }
        public string DockerImageName { get; set; }
        public string DockerRegistryName { get; set; }
        public virtual IEnumerable<PluginCommand> PluginCommands { get; set; }
    }
}
