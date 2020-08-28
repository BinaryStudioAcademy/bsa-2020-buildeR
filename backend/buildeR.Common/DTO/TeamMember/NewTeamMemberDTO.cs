using buildeR.Common.Enums;

namespace buildeR.Common.DTO.TeamMember
{
    public sealed class NewTeamMemberDTO
    {
        public int UserId { get; set; }
        public int GroupId { get; set; }
        public UserRole MemberRole { get; set; }
    }
}
