using AutoMapper;
using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.BuildStep;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class BuildStepService : BaseCrudService<BuildStep, BuildStepDTO, NewBuildStepDTO>, IBuildStepService
    {
        public BuildStepService(BuilderContext context, IMapper mapper) : base(context, mapper)
        {
        }
        public async Task<BuildStepDTO> GetBuildStepById(int id)
        {
            return await base.GetAsync(id);
        }
        public async Task<IEnumerable<BuildStepDTO>> GetAll()
        {
            return await base.GetAllAsync();
        }

        public async Task<BuildStepDTO> Create(NewBuildStepDTO buildStep)
        {
            return await base.AddAsync(buildStep);
        }
        public async Task Update(BuildStepDTO buildStep)
        {
            await base.UpdateAsync(buildStep);
        }
        public async Task Delete(int id)
        {
            await base.RemoveAsync(id);
        }
    }
}
