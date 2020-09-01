using buildeR.Common.DTO.Group;
using buildeR.Common.DTO.User;

namespace buildeR.Common.DTO.GroupInvite
{
    public class GroupInviteDTO
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public int ToUserId { get; set; }
        public int FromUserId { get; set; }
        public bool IsAccepted { get; set; }
        public GroupDTO Group { get; set; }
        public UserDTO FromUser { get; set; }
    }
}
