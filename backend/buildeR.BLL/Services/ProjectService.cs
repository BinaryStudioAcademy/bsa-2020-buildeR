using AutoMapper;

using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.Project;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;

using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public sealed class ProjectService : BaseCrudService<Project, ProjectDTO, NewProjectDTO>, IProjectService
    {
        public ProjectService(BuilderContext context, IMapper mapper) : base(context, mapper)
        {
        }

        public override Task<ProjectDTO> GetAsync(int id, bool isNoTracking = false)
        {
            return base.GetAsync(id, isNoTracking);
        }

        public override Task<IEnumerable<ProjectDTO>> GetAllAsync()
        {
            return base.GetAllAsync();
        }
    }
}
