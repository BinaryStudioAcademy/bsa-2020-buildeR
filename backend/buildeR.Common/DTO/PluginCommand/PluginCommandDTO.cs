using buildeR.Common.DTO.BuildPlugin;
using System.Collections.Generic;

namespace buildeR.Common.DTO.PluginCommand
{
    public sealed class PluginCommandDTO
    {
        public int Id { get; set; }
        public int PluginId { get; set; }
        public string Name { get; set; }

        public BuildPluginDTO Plugin { get; set; }
        public IEnumerable<Arg> Args { get; set; }
    }
}
