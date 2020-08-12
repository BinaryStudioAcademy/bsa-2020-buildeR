using AutoMapper;
using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.BuildHistory;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
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
            return await base.GetAsync(id);
        }
        public async Task<IEnumerable<BuildHistoryDTO>> GetAll()
        {
            return await base.GetAllAsync();
        }
        public async Task<BuildHistoryDTO> Create(NewBuildHistoryDTO build)
        {
            return await base.AddAsync(build);
        }
        public async Task Update(BuildHistoryDTO build)
        {
            await base.UpdateAsync(build);
        }
        public async Task Delete(int id)
        {
            await base.RemoveAsync(id);
        }
    }
}
