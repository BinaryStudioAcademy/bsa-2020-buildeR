using buildeR.Common.DTO.BuildPluginParameter;

using System.Collections.Generic;

namespace buildeR.Common.DTO.BuildStep
{
    public sealed class NewBuildStepDTO
    {
        public string BuildStepName { get; set; }
        public int PluginCommandId { get; set; }
        public int ProjectId { get; set; }
        public int Index { get; set; }
        public int LoggingVerbosity { get; set; }
        public string WorkDirectory { get; set; }
        public ICollection<BuildPluginParameterDTO> BuildPluginParameters { get; set; }
    }
}
