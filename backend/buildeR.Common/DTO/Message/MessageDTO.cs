using buildeR.Common.DTO.Group;
using buildeR.Common.DTO.User;
using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.Common.DTO.Message
{
    public class MessageDTO
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Text { get; set; }
        public int GroupId { get; set; }
        public GroupDTO Group { get; set; }
        public int SenderId { get; set; }
        public UserDTO Sender { get; set; }
    }
}
