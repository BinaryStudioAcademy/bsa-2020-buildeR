using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.NotificationSetting;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface INotificationSettingService : ICrudService<NotificationSettingDTO, NewNotificationSettingDTO, int>
    {
        Task<NotificationSettingDTO> GetNotificationSettingByUserId(int id);
        Task<IEnumerable<NotificationSettingDTO>> GetAll();
        Task<NotificationSettingDTO> GetById(int id);
        Task<NotificationSettingDTO> Create(NewNotificationSettingDTO dto);
        Task<NotificationSettingDTO> Update(NotificationSettingDTO dto);
        Task Delete(int id);
    }
}
