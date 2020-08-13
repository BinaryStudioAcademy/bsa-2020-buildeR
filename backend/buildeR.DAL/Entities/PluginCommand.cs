using buildeR.DAL.Entities.Common;

using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public class PluginCommand : Entity
    {
        public int PluginId { get; set; }
        public string Name { get; set; }
        public string TemplateForDocker { get; set; }

        public virtual BuildPlugin Plugin { get; set; }

        public virtual ICollection<BuildStep> BuildSteps { get; set; }
    }
}
