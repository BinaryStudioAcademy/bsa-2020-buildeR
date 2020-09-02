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
using Org.BouncyCastle.Asn1;

namespace buildeR.BLL.Services
{
    public class BuildService : BaseCrudService<BuildHistory, BuildHistoryDTO, NewBuildHistoryDTO>, IBuildService
    {
        private readonly INotificationsService _notificationsService;
        
        public BuildService(BuilderContext context, IMapper mapper, INotificationsService notificationsService) : base(context, mapper)
        {
            _notificationsService = notificationsService;
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

        public async Task<IEnumerable<BuildHistoryDTO>> GetMonthHistoryByUserId(int id)
        {
           var res = Mapper.Map<IEnumerable<BuildHistory>, IEnumerable<BuildHistoryDTO>>(
                await Context.BuildHistories.AsNoTracking()
                    .Where(bh => bh.PerformerId == id).Where(t => t.StartedAt > DateTime.Today.AddMonths(-1))
                    .Include(bh => bh.Performer)
                    .ToListAsync());
            return res;
        }

        public async Task<BuildHistoryDTO> ChangeStatus(StatusChangeDto statusChange)
        {
            // TODO add checking
            var buildHistory = Context.BuildHistories.Include(bh => bh.Project).FirstOrDefault(bh => bh.Id == statusChange.BuildHistoryId);
            if (buildHistory != null)
            {
                buildHistory.BuildStatus = statusChange.Status;

                if (statusChange.Status != BuildStatus.InProgress)
                {
                    buildHistory.BuildAt = statusChange.Time;
                    buildHistory.Duration = (buildHistory.BuildAt - buildHistory.StartedAt).Value.Milliseconds;
                }
                
                await Context.SaveChangesAsync();

                await _notificationsService.Create(new NewNotificationDTO
                {
                    UserId = buildHistory.PerformerId,
                    Message = $"{StatusToNotificationMessage(buildHistory, statusChange)}",
                    Type = StatusToNotificationType(statusChange),
                    Date = DateTime.Now
                });
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
            };
        }
        
        private static string StatusToNotificationMessage(BuildHistory buildHistory, StatusChangeDto statusChange)
        {
            string action = statusChange.Status switch
            {
                BuildStatus.Error => $"Build errored",
                BuildStatus.Canceled => $"Build canceled",
                BuildStatus.Failure => $"Build failed",
                BuildStatus.Success => $"Build succeeded"
            };
            return $"Build {buildHistory.Number} of {buildHistory.Project.Name} {action} at {statusChange.Time:g}";
        }
    }
}