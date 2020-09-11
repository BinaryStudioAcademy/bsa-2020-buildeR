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
using buildeR.Common.DTO.Notification;
using buildeR.Common.Enums;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;

namespace buildeR.BLL.Services
{
    public class BuildService : BaseCrudService<BuildHistory, BuildHistoryDTO, NewBuildHistoryDTO>, IBuildService
    {
        private readonly INotificationsService _notificationsService;
        private readonly IBuildLogService _buildLogService;

        public BuildService(
            BuilderContext context,
            IMapper mapper,
            INotificationsService notificationsService,
            IBuildLogService buildLogService
        ) : base(context, mapper)
        {
            _notificationsService = notificationsService;
            _buildLogService = buildLogService;
        }

        public async Task<BuildHistoryDTO> GetBuildById(int buildHistoryId)
        {
            var buildHistory = await Context.BuildHistories.AsNoTracking()
                .Include(e => e.Performer)
                .Include(e => e.Project)
                .FirstOrDefaultAsync(e => e.Id == buildHistoryId);

            if (buildHistory is null)
            {
                throw new NotFoundException(nameof(BuildHistory), buildHistoryId);
            }
            
            var logs = await _buildLogService.GetLogs(buildHistory.ProjectId, buildHistory.Id);
            return Mapper.Map<BuildHistoryDTO>(buildHistory, opt => opt.AfterMap((src, dest) => dest.Logs = logs));

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

            var lastHistory = await Context.BuildHistories
                .AsNoTracking()
                .OrderByDescending(bh => bh.Number)
                .FirstOrDefaultAsync(bh => bh.ProjectId == build.ProjectId);

            var historyDto = await base.AddAsync(build);

            var history = await Context.BuildHistories.FindAsync(historyDto.Id);

            int lastNumber = lastHistory?.Number ?? 0;
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
            return Mapper.Map<IEnumerable<BuildHistoryDTO>>(
                await Context.BuildHistories.AsNoTracking()
                    .Where(bh => bh.Project.Id == id)
                    .Include(bh => bh.Performer)
                    .ToListAsync());
        }

        public async Task<BuildHistoryDTO> GetLastHistoryByProjectId(int projectId)
        {
            var buildHistory = await Context.BuildHistories.AsNoTracking()
                .Include(e => e.Performer)
                .Where(e => e.ProjectId == projectId)
                .OrderByDescending(e => e.Number)
                .FirstOrDefaultAsync();

            if (buildHistory is null)
            {
                return null;
            }

            var logs = await _buildLogService.GetLogs(buildHistory.ProjectId, buildHistory.Id);
            return Mapper.Map<BuildHistoryDTO>(buildHistory, opt => opt.AfterMap((src, dest) => dest.Logs = logs));
        }


        public async Task<IEnumerable<BuildHistoryDTO>> GetMonthHistoryByUserId(int id)
        {
           return Mapper.Map<IEnumerable<BuildHistoryDTO>>(
                await Context.BuildHistories.AsNoTracking()
                    .Include(p => p.Performer)
                    .Include(x => x.Project)
                    .Where(p => p.PerformerId == id && p.StartedAt > DateTime.Today.AddMonths(-1))
                    .ToListAsync());
        }

        public async Task<IEnumerable<BuildHistoryDTO>> GetSortedByStartDateHistoryByUserId(int id)
        {
            return Mapper.Map<IEnumerable<BuildHistoryDTO>>(await Context.BuildHistories.AsNoTracking()
                .Where(bh => bh.PerformerId == id)
                .Include(bh => bh.Performer)
                .Include(bh => bh.Project)
                .ThenInclude(bh => bh.Repository)
                .OrderBy(bh => bh.StartedAt)
                .ToListAsync());
        }

        public async Task<BuildHistoryDTO> ChangeStatus(StatusChangeDto statusChange)
        {
            // TODO add checking
            var buildHistory = Context.BuildHistories.Include(bh => bh.Project)
                .FirstOrDefault(bh => bh.Id == statusChange.BuildHistoryId);
            if (buildHistory != null)
            {
                buildHistory.BuildStatus = statusChange.Status;

                if (statusChange.Status != BuildStatus.InProgress)
                {
                    buildHistory.BuildAt = statusChange.Time;
                    buildHistory.Duration = (buildHistory.BuildAt - buildHistory.StartedAt).Value.Milliseconds;
                }

                await Context.SaveChangesAsync();

                if (statusChange.Status != BuildStatus.InProgress)
                {
                    await _notificationsService.Create(new NewNotificationDTO
                    {
                        UserId = buildHistory.PerformerId,
                        Message = $"{StatusToNotificationMessage(buildHistory, statusChange)}",
                        Type = StatusToNotificationType(statusChange),
                        Date = DateTime.Now,
                        ItemId = statusChange.BuildHistoryId
                    });
                }
            }

            return await GetBuildById(statusChange.BuildHistoryId);
        }

        private static NotificationType StatusToNotificationType(StatusChangeDto statusChange)
        {
            return statusChange.Status switch
            {
                BuildStatus.Error => NotificationType.BuildErrored,
                BuildStatus.Canceled => NotificationType.BuildCanceled,
                BuildStatus.Failure => NotificationType.BuildFailed,
                BuildStatus.Success => NotificationType.BuildSucceeded,
                BuildStatus.Pending => NotificationType.Information,
                _ => NotificationType.Information,
            };
        }

        private static string StatusToNotificationMessage(BuildHistory buildHistory, StatusChangeDto statusChange)
        {
            string action = statusChange.Status switch
            {
                BuildStatus.Error => "errored",
                BuildStatus.Canceled => "canceled",
                BuildStatus.Failure => "failed",
                BuildStatus.Success => "succeeded",
                BuildStatus.Pending => "is pending"
            };
            return $"Build #{buildHistory.Number} of {buildHistory.Project.Name} {action} at {statusChange.Time:g}";
        }
    }
}