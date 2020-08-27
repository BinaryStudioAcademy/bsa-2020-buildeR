using buildeR.Common.DTO.TeamMember;

using System.Collections.Generic;

namespace buildeR.Common.DTO.Group
{
    public sealed class NewGroupDTO
    {
        public string Name { get; set; }
        public bool IsPublic { get; set; }
        public string Description { get; set; }
        public int CreatorId { get; set; }
    }
}
