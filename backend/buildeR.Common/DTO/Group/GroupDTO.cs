using buildeR.Common.DTO.ProjectGroup;
using buildeR.Common.DTO.TeamMember;

using System.Collections.Generic;

namespace buildeR.Common.DTO.Group
{
    public sealed class GroupDTO
    {
        public int Id { get; set; }
        public bool IsPublic { get; set; }
        public string Name { get; set; }

        public ICollection<ProjectGroupDTO> ProjectGroups { get; set; }
        public ICollection<TeamMemberDTO> TeamMembers { get; set; }
    }
}
