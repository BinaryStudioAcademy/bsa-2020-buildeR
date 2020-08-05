using System;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public partial class TeamMember
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public string MemberRole { get; set; }
        public long GroupId { get; set; }

        public virtual Group Group { get; set; }
        public virtual User User { get; set; }
    }
}
