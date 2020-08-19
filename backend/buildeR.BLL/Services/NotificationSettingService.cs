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
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class NotificationSettingService : 
        BaseCrudService<NotificationSetting, NotificationSettingDTO, NewNotificationSettingDTO>, 
        INotificationSettingService
    {
        public NotificationSettingService(BuilderContext context, IMapper mapper) : base(context, mapper)  { }

        public async Task<IEnumerable<NotificationSettingDTO>> GetNotificationSettingByUserId(int userId)
        {
            var fromDb = await Context.NotificationSettings
                .AsNoTracking()
                .Where(x => x.UserId == userId).ToListAsync();

            var fromEnum = GetFromEnum(userId);
            var settings = fromDb.Concat(fromEnum.Where(byType => fromDb.All(x => x.NotificationType != byType.NotificationType)));

            return Mapper.Map<IEnumerable<NotificationSettingDTO>>(settings); 
        }
        private IEnumerable<NotificationSetting> GetFromEnum(int userId)
        {
            var settings = Enum.GetValues(typeof(NotificationType))
                .Cast<NotificationType>()
                .Select(type =>
                    new NotificationSetting
                    {
                        UserId = userId,
                        NotificationType = type,
                        App = false,
                        Email = false
                    });
            return settings;
        }
        public async Task<IEnumerable<NotificationSettingDTO>> UpdateRange(IEnumerable<NotificationSettingDTO> settingDTOs)
        {
            var entities = Mapper.Map<IEnumerable<NotificationSetting>>(settingDTOs);
            Context.NotificationSettings.UpdateRange(entities);
            await Context.SaveChangesAsync();
            var updatedsettingDTOs = Mapper.Map<IEnumerable<NotificationSettingDTO>>(entities);
            return updatedsettingDTOs;
        }
        public async Task<IEnumerable<NotificationSettingDTO>> GetAll()
        {
            return await base.GetAllAsync();
        }
        public async Task<NotificationSettingDTO> Create(NewNotificationSettingDTO dto)
        {
            return await base.AddAsync(dto);
        }

        public async Task Delete(int id)
        {
            await base.RemoveAsync(id);
        }

        public async Task Update(NotificationSettingDTO dto)
        {
            await base.UpdateAsync(dto);
        }

        public async Task<NotificationSettingDTO> GetById(int id)
        {
            return await base.GetAsync(id);
        }
    }
}
