using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.NotificationSetting;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface INotificationSettingService : ICrudService<NotificationSettingDTO, NewNotificationSettingDTO, int>
    {
        Task<IEnumerable<NotificationSettingDTO>> GetNotificationSettingByUserId(int id);        
        Task<IEnumerable<NotificationSettingDTO>> UpdateRange(IEnumerable<NotificationSettingDTO> settingDTOs);
        Task<IEnumerable<NotificationSettingDTO>> GetAll();
        Task<NotificationSettingDTO> GetById(int id);
        Task<NotificationSettingDTO> Create(NewNotificationSettingDTO dto);
        Task Update(NotificationSettingDTO dto);
        Task Delete(int id);
    }
}
