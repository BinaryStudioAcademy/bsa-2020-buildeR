using System.Collections.Generic;
using System.Threading.Tasks;
using buildeR.Common.DTO.Notification;

namespace buildeR.BLL.Interfaces
{
    public interface INotificationsService
    {
        Task MarkAsRead(int notificationId);
        Task<IEnumerable<NotificationDTO>> GetNotificationsByUserId(int id);
        Task<NotificationDTO> Create(NewNotificationDTO notification);
    }
}