using buildeR.Common.DTO.BuildPluginParameter;
using buildeR.Common.Enums;

using System.Collections.Generic;

namespace buildeR.Common.DTO.BuildStep
{
    public sealed class ExecutiveBuildStepDTO
    {
        public int BuildStepId { get; set; }
        public string Name { get; set; }
        public int Index { get; set; }
        public string PluginCommand { get; set; }
        public string BuildPluginCommand { get; set; }

        public LoggingVerbosity LoggingVerbosity { get; set; }
        public IEnumerable<BuildPluginParameterDTO> Parameters { get; set; }
    }
}
