using System.Collections.Generic;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.Notification;
using Microsoft.AspNetCore.Mvc;

namespace buildeR.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationsService _notificationsService;

        public NotificationsController(INotificationsService notificationsService)
        {
            _notificationsService = notificationsService;
        }

        [HttpPost("markAsRead/{id}")]
        public async Task MarkAsRead(int id)
        {
            await _notificationsService.MarkAsRead(id);
        }

        [HttpGet("user/{id}")]
        public async Task<IEnumerable<NotificationDTO>> GetNotificationsByUserId(int id)
        {
            return await _notificationsService.GetNotificationsByUserId(id);
        }
        
        [HttpPost]
        public async Task<NotificationDTO> Create(NewNotificationDTO notification)
        {
            return await _notificationsService.Create(notification);
        }
    }
}