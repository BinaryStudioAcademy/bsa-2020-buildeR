using AutoMapper;

using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.BuildHistory;
using buildeR.Common.DTO.Project;
using buildeR.Common.DTO.User;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;

using Microsoft.EntityFrameworkCore;

using System.Collections.Generic;
using System.Linq;
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

        public async Task<IEnumerable<ProjectInfoDTO>> GetProjectsByUser(int userId)
        {
            return await Context.Projects//TODO do need to check user existence?
                .AsNoTracking()
                .Include(project => project.Owner)
                .Where(project => project.OwnerId.Equals(userId))
                .Select(project => new ProjectInfoDTO()
                {
                    Id = project.Id,
                    Name = project.Name,
                    Owner = Mapper.Map<UserDTO>(project.Owner),
                    LastBuildHistory = Mapper.Map<BuildHistoryDTO>(
                          Context.BuildHistories
                            .AsNoTracking()
                            .Where(buildHistory => buildHistory.ProjectId.Equals(project.Id))
                            .Distinct()
                            .Max(buildHistory => buildHistory.BuildAt))

                })
                .ToArrayAsync();
        }
    }
}
