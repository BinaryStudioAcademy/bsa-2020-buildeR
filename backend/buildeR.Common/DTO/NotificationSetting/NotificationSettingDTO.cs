using buildeR.Common.DTO.NotificationSettingOption;
using System.Collections.Generic;

namespace buildeR.Common.DTO.NotificationSetting
{
    public sealed class NotificationSettingDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public bool EnableApp { get; set; }
        public bool EnableEmail { get; set; }
        public ICollection<NotificationSettingOptionDTO> NotificationSettingOptions { get; set; }
    }
}
