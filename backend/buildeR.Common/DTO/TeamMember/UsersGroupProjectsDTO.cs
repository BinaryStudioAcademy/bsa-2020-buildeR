using buildeR.Common.DTO.Project;
using buildeR.Common.Enums;

namespace buildeR.Common.DTO.TeamMember
{
    public class UsersGroupProjectsDTO
    {
        public GroupProjectsDTO GroupProjects { get; set; }
        public GroupRole MemberRole { get; set; }
    }
}