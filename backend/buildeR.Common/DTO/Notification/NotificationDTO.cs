namespace buildeR.Common.DTO.Notification
{
    public sealed class NotificationDTO
    {
        public int Id { get; set; }
        public int EntityId { get; set; }
        public int EntityType { get; set; }
        public int NotificationTrigger { get; set; }
        public string NotificationMessage { get; set; }
    }
}
