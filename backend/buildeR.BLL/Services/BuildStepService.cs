using AutoMapper;
using AutoMapper.QueryableExtensions;

using buildeR.BLL.Exceptions;
using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.BuildPlugin;
using buildeR.Common.DTO.BuildStep;
using buildeR.Common.DTO.PluginCommand;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;

using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class BuildStepService : BaseCrudService<BuildStep, BuildStepDTO, NewBuildStepDTO>, IBuildStepService
    {
        public BuildStepService(BuilderContext context, IMapper mapper) : base(context, mapper) { }
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
            //TODO: reorder other build steps of this project (change indexes)
            await base.RemoveAsync(id);
        }

        public async Task<IEnumerable<EmptyBuildStepDTO>> GetEmptyBuildSteps()
        {
            var buildPlugins = await Context.Set<BuildPlugin>().ToListAsync();
            var pluginCommands = await Context.Set<PluginCommand>().ToListAsync();
            return buildPlugins
                .Join(pluginCommands,
                    buildPlugin => buildPlugin.Id,
                    pluginCommand => pluginCommand.PluginId,
                    (buildPlugin, pluginCommand) => new EmptyBuildStepDTO()
                    {
                        BuildStepName = $"{buildPlugin.PluginName}: {pluginCommand.Name}",
                        BuildPluginId = buildPlugin.Id,
                        BuildPlugin = Mapper.Map<BuildPluginDTO>(buildPlugin),
                        PluginCommand = Mapper.Map<PluginCommandDTO>(pluginCommand),
                        PluginCommandId = pluginCommand.Id
                    }
                );
        }

        public async Task<IEnumerable<BuildStepDTO>> GetBuildStepsByProjectId(int projectId)
        {
            return await Context
                .BuildSteps
                .Where(buildStep => buildStep.ProjectId == projectId)
                .ProjectTo<BuildStepDTO>(Mapper.ConfigurationProvider)
                .ToListAsync();
        }
    }
}
