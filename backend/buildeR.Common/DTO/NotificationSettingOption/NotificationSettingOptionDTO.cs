using buildeR.Common.Enums;

namespace buildeR.Common.DTO.NotificationSettingOption
{
    public sealed class NotificationSettingOptionDTO
    {
        public int Id { get; set; }
        public int NotificationSettingId { get; set; }
        public NotificationType NotificationType { get; set; }
        public bool App { get; set; }
        public bool Email { get; set; }
    }
}
