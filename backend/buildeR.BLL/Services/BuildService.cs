using AutoMapper;
using buildeR.BLL.Exceptions;
using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.BuildHistory;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace buildeR.BLL.Services
{
    public class BuildService : BaseCrudService<BuildHistory, BuildHistoryDTO, NewBuildHistoryDTO>, IBuildService
    {
        public BuildService(BuilderContext context, IMapper mapper) : base(context, mapper) {}

        public async Task<BuildHistoryDTO> GetBuildById(int id)
        {
            var build = await base.GetAsync(id);
            if (build == null)
            {
                throw new NotFoundException(nameof(BuildHistory), id);
            }
            return build;
        }
        public async Task<IEnumerable<BuildHistoryDTO>> GetAll()
        {
            return await base.GetAllAsync();
        }
        public async Task<BuildHistoryDTO> Create(NewBuildHistoryDTO build)
        {
            if (build == null)
            {
                throw new ArgumentNullException();
            }

            var lastNumber = Context.BuildHistories.AsNoTracking().Where(bh => bh.ProjectId == build.ProjectId)
                .Select(bh => bh.Number).Max();

            var history = await base.AddAsync(build);

            history.Number = lastNumber + 1;

            await Update(history);

            return history;
        }
        public async Task Update(BuildHistoryDTO build)
        {
            if (build == null)
            {
                throw new ArgumentNullException();
            }
            await base.UpdateAsync(build);
        }
        public async Task Delete(int id)
        {
            var build = await base.GetAsync(id);
            if (build == null)
            {
                throw new NotFoundException(nameof(BuildHistory), id);
            }
            await base.RemoveAsync(id);
        }

        public async Task<IEnumerable<BuildHistoryDTO>> GetHistoryByProjectId(int id)
        {
            return Mapper.Map<IEnumerable<BuildHistory>, IEnumerable<BuildHistoryDTO>>(await Context.BuildHistories.AsNoTracking().Where(bh => bh.Project.Id == id).ToListAsync());
        }
    }
}
