using buildeR.Common.Enums;
using System;

namespace buildeR.Common.DTO.TeamMember
{
    public sealed class NewTeamMemberDTO
    {
        public int UserId { get; set; }
        public int GroupId { get; set; }
        public GroupRole MemberRole { get; set; }
        public DateTime JoinedDate { get; set; }
    }
}
