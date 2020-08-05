using System;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public partial class UserSocialNetwork
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public long SocialNetworkId { get; set; }
        public string SocialNetworkUrl { get; set; }

        public virtual SocialNetwork SocialNetwork { get; set; }
        public virtual User User { get; set; }
    }
}
