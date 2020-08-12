using AutoMapper;
using buildeR.BLL.Exceptions;
using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.BuildStep;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using System;
using System.Collections.Generic;
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
            var buildStep = await base.GetAsync(id);
            if (buildStep == null)
            {
                throw new NotFoundException(nameof(BuildStep), id);
            }
            return buildStep;
        }
        public async Task<IEnumerable<BuildStepDTO>> GetAll()
        {
            return await base.GetAllAsync();
        }

        public async Task<BuildStepDTO> Create(NewBuildStepDTO buildStep)
        {
            if (buildStep == null)
            {
                throw new ArgumentNullException();
            }
            return await base.AddAsync(buildStep);
        }
        public async Task Update(BuildStepDTO buildStep)
        {
            if (buildStep == null)
            {
                throw new ArgumentNullException();
            }
            await base.UpdateAsync(buildStep);
        }
        public async Task Delete(int id)
        {
            var buildStep = await base.GetAsync(id);
            if (buildStep == null)
            {
                throw new NotFoundException(nameof(BuildStep), id);
            }
            await base.RemoveAsync(id);
        }
    }
}
