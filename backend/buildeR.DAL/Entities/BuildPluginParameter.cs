using buildeR.DAL.Entities.Common;

namespace buildeR.DAL.Entities
{
    public class BuildPluginParameter: Entity
    {
        public int BuildStepId { get; set; }
        public string ParameterValue { get; set; }
        public string ParameterKey { get; set; }

        public virtual BuildStep BuildStep { get; set; }
    }
}
