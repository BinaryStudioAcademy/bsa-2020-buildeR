using buildeR.Common.DTO.BuildPlugin;
using buildeR.Common.DTO.BuildPluginParameter;
using buildeR.Common.DTO.PluginCommand;
using buildeR.Common.Enums;

using System.Collections.Generic;

namespace buildeR.Common.DTO.BuildStep
{
    public sealed class BuildStepDTO
    {
        public int Id { get; set; }
        public string BuildStepName { get; set; }
        public int PluginCommandId { get; set; }
        public int ProjectId { get; set; }
        public int Index { get; set; }
        public LoggingVerbosity LoggingVerbosity { get; set; }
        public string WorkDirectory { get; set; }
        public string DockerImageVersion { get; set; }
        

        public PluginCommandDTO PluginCommand { get; set; }
        public BuildPluginDTO BuildPlugin { get; set; }
        public IEnumerable<CommandArgumentDTO> CommandArguments { get; set; }
        public IEnumerable<BuildPluginParameterDTO> Parameters { get; set; }
    }
}
