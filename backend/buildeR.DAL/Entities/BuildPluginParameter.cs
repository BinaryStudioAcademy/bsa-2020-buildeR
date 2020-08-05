using buildeR.DAL.Entities.Common;

namespace buildeR.DAL.Entities
{
    public class BuildPluginParameter: Entity
    {
        public int BuildStepId { get; set; }
        public string Value { get; set; }
        public string Key { get; set; }

        public virtual BuildStep BuildStep { get; set; }
    }
}
