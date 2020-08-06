using buildeR.Common.DTO.Group;
using buildeR.Common.DTO.Project;

namespace buildeR.Common.DTO.ProjectGroup
{
    public sealed class ProjectGroupDTO
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public int ProjectId { get; set; }

        public GroupDTO Group { get; set; }
        public ProjectDTO Project { get; set; }
    }
}
