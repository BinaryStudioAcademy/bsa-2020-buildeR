using System;

namespace buildeR.Common.DTO.GroupInvite
{
    public class NewGroupInviteDTO
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public int ToUserId { get; set; }
        public int FromUserId { get; set; }
        public bool IsAccepted { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
