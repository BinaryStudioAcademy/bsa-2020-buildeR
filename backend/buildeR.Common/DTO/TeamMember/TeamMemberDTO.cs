using buildeR.Common.DTO.Group;
using buildeR.Common.DTO.User;

namespace buildeR.Common.DTO.TeamMember
{
    public sealed class TeamMemberDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int GroupId { get; set; }
        public int MemberRole { get; set; }

        public GroupDTO Group { get; set; }
        public UserDTO User { get; set; }
    }
}
