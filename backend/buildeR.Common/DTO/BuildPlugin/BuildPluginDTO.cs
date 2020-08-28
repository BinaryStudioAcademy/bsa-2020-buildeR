using buildeR.Common.DTO.PluginCommand;

using System.Collections.Generic;

namespace buildeR.Common.DTO.BuildPlugin
{
    public sealed class BuildPluginDTO
    {
        public int Id { get; set; }
        public string PluginName { get; set; }
        public string Command { get; set; }
        public string DockerImageName { get; set; }
        public string DockerRegistryName { get; set; }
    }
}
