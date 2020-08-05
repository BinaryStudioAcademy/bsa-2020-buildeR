using buildeR.DAL.Entities.Common;
using System.Collections.Generic;

namespace buildeR.DAL.Entities
{
    public class SocialNetwork: Entity
    {
        public SocialNetwork()
        {
            UserSocialNetwork = new HashSet<UserSocialNetwork>();
        }

        public int ProviderId { get; set; }

        public virtual ICollection<UserSocialNetwork> UserSocialNetwork { get; set; }
    }
}
