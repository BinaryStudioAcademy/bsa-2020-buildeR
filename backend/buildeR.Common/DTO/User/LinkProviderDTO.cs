using buildeR.Common.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.Common.DTO.User
{
    public sealed class LinkProviderDTO
    {
        public int UserId { get; set; }
        public string UId { get; set; }
        public Provider ProviderId { get; set; }
        public string ProviderUrl { get; set; }
    }
}
