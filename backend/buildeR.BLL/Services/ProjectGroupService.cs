using AutoMapper;
using buildeR.BLL.Exceptions;
using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.ProjectGroup;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Math.EC.Rfc7748;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class ProjectGroupService : BaseCrudService<ProjectGroup, ProjectGroupDTO, NewProjectGroupDTO>, IProjectGroupService
    {
        public ProjectGroupService(BuilderContext context, IMapper mapper) : base(context, mapper)
        {
        }

        public async Task<ProjectGroupDTO> Create(NewProjectGroupDTO project)
        {
            if (project == null)
            {
                throw new ArgumentException("Project is null");
            }
            return await base.AddAsync(project);
        }

        public async Task Delete(int groupId, int projectId)
        {
            var proj = await Context.ProjectGroups.FirstOrDefaultAsync(x => x.GroupId == groupId
            && x.ProjectId == projectId);
            if (proj == null)
            {
                throw new NotFoundException("Project or group not found");
            }
            await base.RemoveAsync(proj.Id);
        }
    }
}
