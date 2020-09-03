using System;
using buildeR.Common.DTO.User;
using buildeR.Common.Enums;

namespace buildeR.Common.DTO.Notification
{
    public sealed class NotificationDTO
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public DateTime Date { get; set; }
        public bool IsRead { get; set; }
        public NotificationType Type { get; set; }
        public int? UserId { get; set; }
    }
}
