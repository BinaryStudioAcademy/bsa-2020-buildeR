using System;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public partial class PluginCommand
    {
        public long Id { get; set; }
        public long PluginId { get; set; }

        public virtual BuildPlugin Plugin { get; set; }
    }
}
