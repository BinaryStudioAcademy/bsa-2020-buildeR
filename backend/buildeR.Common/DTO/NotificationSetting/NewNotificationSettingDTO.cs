
namespace buildeR.Common.DTO.NotificationSetting
{
    public sealed class NewNotificationSettingDTO
    {
        public int UserId { get; set; }
        public bool EnableApp { get; set; }
        public bool EnableEmail { get; set; }
    }
}
