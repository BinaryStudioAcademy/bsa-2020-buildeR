using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.Common.DTO.Group
{
    public sealed class RemoveGroupDTO
    {
        public int InitiatorUserId { get; set; }
        public int GroupId { get; set; }
    }
}
