using AutoMapper;
using buildeR.BLL.Exceptions;
using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.BuildHistory;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class BuildService : BaseCrudService<BuildHistory, BuildHistoryDTO, NewBuildHistoryDTO>, IBuildService
    {
        public BuildService(BuilderContext context, IMapper mapper) : base(context, mapper)
        {
        }
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
            return await base.AddAsync(build);
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
    }
}
