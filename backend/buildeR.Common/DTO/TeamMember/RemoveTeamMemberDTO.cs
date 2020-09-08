using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.Common.DTO.TeamMember
{
    public sealed class RemoveTeamMemberDTO
    {
        public int Id { get; set; }
        public int InitiatorUserId { get; set; }
        public int GroupId { get; set; }
    }
}
