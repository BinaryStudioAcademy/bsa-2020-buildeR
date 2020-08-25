using buildeR.DAL.Entities.Common;

namespace buildeR.DAL.Entities
{
    public class CommandArgument : Entity
    {
        public string Key { get; set; }
        public string Value { get; set; }

        public int BuildStepId { get; set; }
        public BuildStep BuildStep { get; set; }
    }
}
