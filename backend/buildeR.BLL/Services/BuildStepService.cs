using AutoMapper;
using AutoMapper.QueryableExtensions;

using buildeR.BLL.Exceptions;
using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO;
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
            var buildStep = await Context
                .BuildSteps
                .Include(step => step.CommandArguments)
                .FirstOrDefaultAsync(step => step.Id.Equals(id));
            if (buildStep == null)
            {
                throw new NotFoundException(nameof(BuildStep), id);
            }
            return Mapper.Map<BuildStepDTO>(buildStep);
        }
        public async Task<IEnumerable<BuildStepDTO>> GetAll()
        {
            return await Context
                .Set<BuildStep>()
                .Include(buildStep => buildStep.CommandArguments)
                .AsNoTracking()
                .ProjectTo<BuildStepDTO>(Mapper.ConfigurationProvider)
                .ToListAsync();
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
            foreach (var argDTO in buildStep.CommandArguments)
            {
                var arg = Mapper.Map<CommandArgument>(argDTO);
                if (!base.Context.CommandArguments.Contains(arg))
                    base.Context.CommandArguments.Add(arg);
            }

            await base.UpdateAsync(buildStep);
        }
        public async Task Delete(int id)
        {
            var stepToDelete = await base.GetAsync(id);
            if (stepToDelete == null)
            {
                throw new NotFoundException(nameof(BuildStep), id);
            }

            var buildStepCommandArguments = await Context
                .CommandArguments
                .AsNoTracking()
                .Where(commandArgument => commandArgument.Id.Equals(id))
                .ToListAsync();

            Context.CommandArguments.RemoveRange(buildStepCommandArguments);

            //Need to change indexes of other build steps 
            var projectBuildStepsWithIndexMoreBuildStepToDelete = await Context
                .BuildSteps
                .AsNoTracking()
                .Where(buildStep => buildStep.ProjectId == stepToDelete.ProjectId && buildStep.Index > stepToDelete.Index)
                .ToListAsync();

            foreach (var buildStep in projectBuildStepsWithIndexMoreBuildStepToDelete)
            {
                --buildStep.Index;
                Context.Entry(buildStep).State = EntityState.Modified;
            }

            await base.RemoveAsync(id);
        }

        public async Task<IEnumerable<EmptyBuildStepDTO>> GetEmptyBuildStepsAsync()
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

        public async Task<IEnumerable<BuildStepDTO>> GetBuildStepsByProjectIdAsync(int projectId)
        {
            return await Context
                .BuildSteps
                .Include(buildStep => buildStep.CommandArguments)
                .Where(buildStep => buildStep.ProjectId == projectId)
                .OrderBy(buildStep => buildStep.Index)
                .ProjectTo<BuildStepDTO>(Mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task UpdateIndexesOfBuildStepsAsync(int projectId, int newIndex, int oldIndex)
        {
            var buildStepsToReduceIndex = await Context
                .BuildSteps
                .AsNoTracking()
                .Where(buildStep => buildStep.ProjectId == projectId &&
                                    buildStep.Index > oldIndex &&
                                    buildStep.Index <= newIndex)
                .ToListAsync();

            foreach (var buildStep in buildStepsToReduceIndex)
            {
                --buildStep.Index;
                Context.Entry(buildStep).State = EntityState.Modified;
            }

            var buildStepsToIncreaseIndex = await Context
                .BuildSteps
                .AsNoTracking()
                .Where(buildStep => buildStep.ProjectId == projectId &&
                                    buildStep.Index >= newIndex &&
                                    buildStep.Index < oldIndex)
                .ToListAsync();

            foreach (var buildStep in buildStepsToIncreaseIndex)
            {
                ++buildStep.Index;
                Context.Entry(buildStep).State = EntityState.Modified;
            }

            var movedBuildStep = await Context
                .BuildSteps
                .FirstOrDefaultAsync(buildStep => buildStep.ProjectId == projectId && buildStep.Index == oldIndex);

            movedBuildStep.Index = newIndex;
            Context.Entry(movedBuildStep).State = EntityState.Modified;

            await Context.SaveChangesAsync();
        }
    }
}
