using buildeR.Common.DTO.BuildPluginParameter;

using System.Collections.Generic;

namespace buildeR.Common.DTO.BuildStep
{
    public sealed class NewBuildStepDTO
    {
        public string BuildStepName { get; set; }
        public int BuildPluginId { get; set; }
        public int LoggingVerbosity { get; set; }
        public int ProjectId { get; set; }
        public ICollection<BuildPluginParameterDTO> BuildPluginParameters { get; set; }
    }
}
