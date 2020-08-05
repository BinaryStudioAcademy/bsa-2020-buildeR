using System;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public partial class ProjectGroup
    {
        public long Id { get; set; }
        public long GroupId { get; set; }
        public long ProjectId { get; set; }

        public virtual Group Group { get; set; }
        public virtual Project Project { get; set; }
    }
}
