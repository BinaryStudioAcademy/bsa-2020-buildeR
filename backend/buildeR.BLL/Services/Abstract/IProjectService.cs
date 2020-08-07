using buildeR.Common.DTO.Project;

using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Services.Abstract
{
    public interface IProjectService : ICrudService<ProjectDTO, NewProjectDTO, int>
    {
        Task<IEnumerable<ProjectInfoDTO>> GetProjectsByUser(int userId);
    }
}
