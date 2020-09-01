using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.ProjectGroup;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IProjectGroupService : ICrudService<ProjectGroupDTO, NewProjectGroupDTO, int>
    {
        Task<ProjectGroupDTO> Create(NewProjectGroupDTO project);
        Task Delete(int groupId, int projectId);
    }
}
