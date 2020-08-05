using buildeR.Common.DTO.TeamMember;

using System.Collections.Generic;

namespace buildeR.Common.DTO.Group
{
    public sealed class NewGroupDTO
    {
        public string Name { get; set; }
        public bool IsPublic { get; set; }

        public ICollection<NewTeamMemberDTO> TeamMembers { get; set; }
    }
}
