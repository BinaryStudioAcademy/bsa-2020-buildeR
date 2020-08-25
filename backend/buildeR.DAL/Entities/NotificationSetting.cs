using buildeR.DAL.Entities.Common;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public class NotificationSetting : Entity
    {
        public NotificationSetting()
        {
            NotificationSettingOptions = new HashSet<NotificationSettingOption>();
        }
        public int UserId { get; set; }
        public User User { get; set; }
        public bool EnableApp { get; set; }
        public bool EnableEmail { get; set; }
        public virtual ICollection<NotificationSettingOption> NotificationSettingOptions { get; set; }
    }
}
