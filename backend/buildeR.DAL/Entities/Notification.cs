
using buildeR.Common.Enums;
using buildeR.DAL.Entities.Common;

namespace buildeR.DAL.Entities
{
    public class Notification: Entity
    {
        public EntityType EntityType { get; set; }
        public NotificationTrigger NotificationTrigger { get; set; }
        public string NotificationMessage { get; set; }
        public int EntityId { get; set; }
    }
}
