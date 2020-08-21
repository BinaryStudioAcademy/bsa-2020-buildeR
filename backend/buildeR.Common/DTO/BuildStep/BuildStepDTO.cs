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
        public string Name { get; set; }
        public string WorkDirectory { get; set; }
        public PluginCommandDTO PluginCommand { get; set; }
        public BuildPluginDTO BuildPlugin { get; set; }

        public LoggingVerbosity LoggingVerbosity { get; set; }
        public IEnumerable<BuildPluginParameterDTO> Parameters { get; set; }
    }
}
