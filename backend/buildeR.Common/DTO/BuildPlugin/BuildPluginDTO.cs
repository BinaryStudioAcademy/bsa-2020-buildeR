using buildeR.Common.DTO.PluginCommand;

using System.Collections.Generic;

namespace buildeR.Common.DTO.BuildPlugin
{
    public sealed class BuildPluginDTO
    {
        public int Id { get; set; }
        public string PluginName { get; set; }
        public string Runner { get; set; }
        public string DockerImage { get; set; }
        public float Version { get; set; }

        public ICollection<PluginCommandDTO> PluginCommands { get; set; } //is needed?
    }
}
