using System.Collections.Generic;
using buildeR.Common.DTO.Group;

namespace buildeR.Common.DTO.Project
{
    public class GroupProjectsDTO
    {
        public ICollection<ProjectInfoDTO> Projects { get; set; }
        public GroupDTO Group { get; set; }
    }
}