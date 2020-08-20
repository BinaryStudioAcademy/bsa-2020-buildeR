using buildeR.Common.Enums;

namespace buildeR.Common.DTO.NotificationSetting
{
    public sealed class NotificationSettingDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public NotificationType NotificationType { get; set; }
        public bool App { get; set; }
        public bool Email { get; set; }
    }
}
