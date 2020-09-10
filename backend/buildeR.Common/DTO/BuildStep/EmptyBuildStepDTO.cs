using buildeR.Common.DTO.BuildPlugin;
using buildeR.Common.DTO.PluginCommand;

namespace buildeR.Common.DTO.BuildStep
{
    public sealed class EmptyBuildStepDTO
    {
        public string BuildStepName { get; set; }

        public BuildPluginDTO BuildPlugin { get; set; }
        public PluginCommandDTO PluginCommand { get; set; }

        public int BuildPluginId { get; set; }
        public int PluginCommandId { get; set; }
        public string Config { get; set; }
    }
}
