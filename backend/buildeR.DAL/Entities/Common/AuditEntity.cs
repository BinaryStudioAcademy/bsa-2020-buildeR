using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.DAL.Entities.Common
{
    public abstract class AuditEntity : Entity
    {
        public DateTime CreatedAt { get; set; }
    }
}
