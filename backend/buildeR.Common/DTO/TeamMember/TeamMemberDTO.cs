using buildeR.Common.DTO.Group;
using buildeR.Common.DTO.User;
using buildeR.Common.Enums;
using System;

namespace buildeR.Common.DTO.TeamMember
{
    public sealed class TeamMemberDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int GroupId { get; set; }
        public UserRole MemberRole { get; set; }
        public DateTime JoinedDate { get; set; }

        public GroupDTO Group { get; set; }
        public UserDTO User { get; set; }
    }
}
