using System;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public partial class SocialNetwork
    {
        public SocialNetwork()
        {
            UserSocialNetwork = new HashSet<UserSocialNetwork>();
        }

        public long Id { get; set; }
        public long ProviderId { get; set; }

        public virtual ICollection<UserSocialNetwork> UserSocialNetwork { get; set; }
    }
}
