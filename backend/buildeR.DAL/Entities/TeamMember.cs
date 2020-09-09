using buildeR.Common.Enums;
using buildeR.DAL.Entities.Common;
using System;

namespace buildeR.DAL.Entities
{
    public class TeamMember: Entity
    {
        public int UserId { get; set; }
        public GroupRole MemberRole { get; set; }
        public int GroupId { get; set; }
        public DateTime JoinedDate { get; set; }
        public bool IsAccepted { get; set; }
        public virtual Group Group { get; set; }
        public virtual User User { get; set; }
    }
}
