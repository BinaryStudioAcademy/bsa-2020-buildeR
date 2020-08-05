using System;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public partial class Notification
    {
        public long Id { get; set; }
        public int EntityType { get; set; }
        public int? NotificationTrigger { get; set; }
        public string NotificationMessage { get; set; }
        public long EntityId { get; set; }
    }
}
