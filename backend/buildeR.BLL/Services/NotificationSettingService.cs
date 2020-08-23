using AutoMapper;
using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.NotificationSetting;
using buildeR.Common.Enums;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class NotificationSettingService : 
        BaseCrudService<NotificationSetting, NotificationSettingDTO, NewNotificationSettingDTO>, 
        INotificationSettingService
    {
        public NotificationSettingService(BuilderContext context, IMapper mapper) : base(context, mapper)  { }

        public async Task<NotificationSettingDTO> GetNotificationSettingByUserId(int userId)
        {
            var notificationSetting = await Context.NotificationSettings
                .AsNoTracking()
                .Include(notSetOp => notSetOp.NotificationSettingOptions)
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (notificationSetting == null) // when user don't have notification settings yet
            {
                var newNotSet = new NotificationSetting
                {
                    UserId = userId,
                    EnableApp = true,
                    EnableEmail = false,
                };
                var additionResult = await Context.NotificationSettings.AddAsync(newNotSet);
                await Context.SaveChangesAsync();
                notificationSetting = await Context.NotificationSettings.FindAsync(additionResult.Entity.Id);
            }

            var fromEnum = GetOptionsFromEnum(userId);

            notificationSetting.NotificationSettingOptions = notificationSetting.NotificationSettingOptions
                .Concat(fromEnum.Where(byType => notificationSetting.NotificationSettingOptions.All(x => x.NotificationType != byType.NotificationType)))
                .ToList();

            return Mapper.Map<NotificationSettingDTO>(notificationSetting);
        }
        private IEnumerable<NotificationSettingOption> GetOptionsFromEnum(int NotificationSettingId)
        {
            var options = Enum.GetValues(typeof(NotificationType))
                .Cast<NotificationType>()
                .Select(type =>
                    new NotificationSettingOption
                    {
                        NotificationSettingId = NotificationSettingId,
                        NotificationType = type,
                        App = true,
                        Email = false
                    });
            return options;
        }
        public async Task Update(NotificationSettingDTO dto)
        {
            var entity = Mapper.Map<NotificationSetting>(dto);
            Context.NotificationSettings.Update(entity);
            await Context.SaveChangesAsync();
        }
        public async Task<IEnumerable<NotificationSettingDTO>> GetAll()
        {
            return await base.GetAllAsync();
        }
        public async Task<NotificationSettingDTO> GetById(int id)
        {
            return await base.GetAsync(id);
        }
        public async Task<NotificationSettingDTO> Create(NewNotificationSettingDTO dto)
        {
            return await base.AddAsync(dto);
        }

        public async Task Delete(int id)
        {
            await base.RemoveAsync(id);
        }
    }
}
