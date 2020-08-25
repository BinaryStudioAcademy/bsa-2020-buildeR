using buildeR.Common.Enums;
using buildeR.DAL.Entities.Common;

namespace buildeR.DAL.Entities
{
    public class NotificationSettingOption : Entity
    {
        public int NotificationSettingId { get; set; }
        public NotificationSetting NotificationSetting { get; set; }
        public NotificationType NotificationType { get; set; }
        public bool App { get; set; }
        public bool Email { get; set; }
    }
}
