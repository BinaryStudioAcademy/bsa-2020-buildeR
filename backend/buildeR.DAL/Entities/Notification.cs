
using System;
using buildeR.Common.Enums;
using buildeR.DAL.Entities.Common;

namespace buildeR.DAL.Entities
{
    public class Notification: Entity
    {
        public string Message { get; set; }
        public DateTime Date { get; set; }
        public bool IsRead { get; set; }
        public NotificationType Type { get; set; }
        public int? UserId { get; set; }
        public User User { get; set; }
        public int? ItemId { get; set; }
    }
}
    