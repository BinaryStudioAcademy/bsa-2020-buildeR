using buildeR.Common.Enums;
using buildeR.DAL.Entities.Common;

namespace buildeR.DAL.Entities
{
    public class NotificationSetting : Entity
    {
        public int UserId { get; set; }
        public User User { get; set; }
        public NotificationType NotificationType { get; set; }
        public bool App { get; set; }
        public bool Email { get; set; }
    }
}
