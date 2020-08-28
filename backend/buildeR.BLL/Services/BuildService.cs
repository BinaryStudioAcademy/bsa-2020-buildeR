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
using buildeR.Common.DTO;
using buildeR.Common.Enums;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1;

namespace buildeR.BLL.Services
{
    public class BuildService : BaseCrudService<BuildHistory, BuildHistoryDTO, NewBuildHistoryDTO>, IBuildService
    {
        public BuildService(BuilderContext context, IMapper mapper) : base(context, mapper)
        {
        }

        public async Task<BuildHistoryDTO> GetBuildById(int id)
        {
            var build = await Context.BuildHistories.FindAsync(id);
            if (build == null)
            {
                throw new NotFoundException(nameof(BuildHistory), id);
            }

            await Context.Entry(build).Reference(bh => bh.Performer).LoadAsync();
            return Mapper.Map<BuildHistoryDTO>(build);
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

            var buildHistoriesOfProject =
                Context.BuildHistories.AsNoTracking().Where(bh => bh.ProjectId == build.ProjectId);

            int lastNumber = buildHistoriesOfProject.Any() ? buildHistoriesOfProject.Select(bh => bh.Number).Max() : 0;

            var historyDto = await base.AddAsync(build);

            var history = await Context.BuildHistories.FindAsync(historyDto.Id);

            history.Number = lastNumber + 1;
            history.BuildStatus = BuildStatus.Pending;
            history.StartedAt = DateTime.Now;

            await Context.SaveChangesAsync();

            return await GetBuildById(history.Id);
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
            return Mapper.Map<IEnumerable<BuildHistory>, IEnumerable<BuildHistoryDTO>>(
                await Context.BuildHistories.AsNoTracking()
                    .Where(bh => bh.Project.Id == id)
                    .Include(bh => bh.Performer)
                    .ToListAsync());
        }

        public async Task<BuildHistoryDTO> ChangeStatus(StatusChangeDto statusChange)
        {
            // TODO add checking
            var buildHistory = await Context.BuildHistories.FindAsync(statusChange.BuildHistoryId);
            if (buildHistory != null)
            {
                buildHistory.BuildStatus = statusChange.Status;

                if (statusChange.Status != BuildStatus.InProgress)
                {
                    buildHistory.BuildAt = DateTime.Now;
                    buildHistory.Duration = (buildHistory.BuildAt - buildHistory.StartedAt).Value.Milliseconds;
                }
                
                await Context.SaveChangesAsync();
            }

            return await GetBuildById(statusChange.BuildHistoryId);
        }
    }
}