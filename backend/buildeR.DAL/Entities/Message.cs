using buildeR.DAL.Entities.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.DAL.Entities
{
    public class Message : AuditEntity
    {
        public string Text { get; set; }
        public int GroupId { get; set; }
        public Group Group { get; set; }
        public int SenderId { get; set; }
        public User Sender { get; set; }
    }
}
