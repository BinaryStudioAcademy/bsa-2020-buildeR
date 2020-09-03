using System;
using buildeR.Common.Enums;

namespace buildeR.Common.DTO.Notification
{
    public sealed class NewNotificationDTO
    {
        public string Message { get; set; }
        public DateTime Date { get; set; }
        public NotificationType Type { get; set; }
        public int? UserId { get; set; }
    }
}
