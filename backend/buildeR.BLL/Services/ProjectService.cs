using AutoMapper;
using buildeR.BLL.Exceptions;
using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.BuildHistory;
using buildeR.Common.DTO.BuildStep;
using buildeR.Common.DTO.Project;
using buildeR.Common.DTO.Repository;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;

using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public sealed class ProjectService : BaseCrudService<Project, ProjectDTO, NewProjectDTO>, IProjectService
    {
        private readonly IQuartzService _quartzService;
        private readonly IBuildStepService _buildStepService;
        private readonly ISynchronizationHelper _synchronizationHelper;
        public ProjectService(BuilderContext context,
                              IMapper mapper,
                              IQuartzService quartzService, 
                              IBuildStepService buildStepService,
                              ISynchronizationHelper synchronizationHelper) : base(context, mapper)
        {
            _quartzService = quartzService;
            _buildStepService = buildStepService;
            _synchronizationHelper = synchronizationHelper;
        }

        public override Task<ProjectDTO> GetAsync(int id, bool isNoTracking = false)
        {
            return base.GetAsync(id, isNoTracking);
        }
        
        public async Task<IEnumerable<ProjectInfoDTO>> GetProjectsByUser(int userId)
        {
           
            var projects = await Context.Projects
                .AsNoTracking()
                .Include(project => project.Owner)
                .Include(project => project.BuildHistories)
                .Where(project => project.OwnerId == userId)
                .ToArrayAsync();
            var projectInfos = Mapper.Map<IEnumerable<ProjectInfoDTO>>(projects);
            return projectInfos;
        }

        public async Task<ProjectDTO> GetProjectByUserId(int userId, int projectId)
        {
            var project = await GetAsync(projectId);
            if (project.OwnerId == userId)
            {
                return project;
            }
            throw new ForbiddenExeption("Read", project.Name, project.Id);
        }
        public async Task<ProjectDTO> CreateProject(NewProjectDTO dto)
        {
            var createdProject =  await base.AddAsync(dto);
            if(createdProject._Repository.CreatedByLink)
            {
                createdProject._Repository.Owner = _synchronizationHelper.GetRepositoryOwnerFromUrl(createdProject._Repository.Url);
                createdProject._Repository.Name = _synchronizationHelper.GetRepositoryNameFromUrl(createdProject._Repository.Url);
                await UpdateProject(createdProject, createdProject.OwnerId);
            }
            return createdProject;
        }
        public async Task UpdateProject(ProjectDTO dto, int userId)
        {
            var project = await GetAsync(dto.Id);
            if (project.OwnerId == userId)
            {
                await base.UpdateAsync(dto);
            }
            throw new ForbiddenExeption("Update", project.Name, project.Id);
        }

        public async Task DeleteProject(int id)
        {
            await _quartzService.DeleteAllSheduleJob(id.ToString());
            var project = await GetAsync(id);
            if (project == null)
            {
                throw new NotFoundException(nameof(Project), id);
            }
            await base.RemoveAsync(id);     
        }       
        public async Task<ExecutiveBuildDTO> GetExecutiveBuild(int projectId)
        {
            var project = await Context.Projects
                                    .Include(p => p.BuildSteps)
                                        .ThenInclude(s => s.PluginCommand)
                                            .ThenInclude(c => c.Plugin)
                                    .Include(p => p.BuildSteps)
                                        .ThenInclude(s => s.BuildPluginParameters)
                                    .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null)
                throw new NotFoundException("Project", projectId);

            var executiveBuild = new ExecutiveBuildDTO
            {
                ProjectId = project.Id,
                RepositoryUrl = project.Repository,
                BuildSteps = project.BuildSteps
                    .Select(buildStep => Mapper.Map<BuildStepDTO>(buildStep))
                    .OrderBy(buildStep => buildStep.Index)
            };


            return executiveBuild;
        }
    

        public async Task ChangeFavoriteStateAsync(int projectId)
        {
            var project = await Context.Set<Project>().AsNoTracking().SingleAsync(entity => entity.Id == projectId);
            project.IsFavorite = !project.IsFavorite;

            Context.Entry(project).State = EntityState.Modified;
            await Context.SaveChangesAsync();
        }
        public async Task<ProjectDTO> CopyProject(ProjectDTO dto)
        {
            var existingProject = await GetProjectWithBuildSteps(dto.Id);
            var newProject = new ProjectDTO
            {
                Description = dto.Description,
                Name = dto.Name,
                OwnerId = dto.OwnerId,
                IsPublic = dto.IsPublic,
                IsFavorite = dto.IsFavorite,
                Repository = dto.Repository,
                CredentialsId = dto.CredentialsId,
                IsAutoCancelBranchBuilds = dto.IsAutoCancelBranchBuilds,
                IsCleanUpBeforeBuild = dto.IsCleanUpBeforeBuild,
                IsAutoCancelPullRequestBuilds = dto.IsAutoCancelPullRequestBuilds,
                CancelAfter = dto.CancelAfter,
            };

            var createdProject = (await Context.AddAsync(Mapper.Map<Project>(newProject))).Entity;
            Context.SaveChanges();
            int id = createdProject.Id;
            existingProject.BuildSteps.Select(buildStep => _buildStepService.Create(new NewBuildStepDTO
            {
                ProjectId = id,
                BuildStepName = buildStep.BuildStepName,
                PluginCommandId = buildStep.PluginCommand.PluginId,
                Index =  buildStep.Index,
                BuildPluginParameters = buildStep.Parameters.ToList(),
                LoggingVerbosity = (int)buildStep.LoggingVerbosity
            }));
            var project = await Context.Projects
                                                .Include(p => p.BuildSteps)
                                                .Include(p => p.Owner)
                                                .FirstOrDefaultAsync(p => p.Id == id);

            return Mapper.Map<ProjectDTO>(project);
        }
        public async Task<RepositoryDTO> GetRepository(int projectId)
        {
            var repository = await Context.Projects.Include(p => p._Repository)
                                                   .FirstOrDefaultAsync(p => p.Id == projectId);

            return Mapper.Map<RepositoryDTO>(repository);
        }
        private async Task<ProjectDTO> GetProjectWithBuildSteps(int id)
        {
            var project = await Context.Projects.Include(p => p.BuildSteps)
                                                .Include(p => p.Owner)
                                                .FirstOrDefaultAsync(p => p.Id == id);
            return Mapper.Map<ProjectDTO>(project);
        }
    }
}