using buildeR.DAL.Entities.Common;

namespace buildeR.DAL.Entities
{
    public class UserSocialNetwork: Entity
    {
        public int UserId { get; set; }
        public int SocialNetworkId { get; set; }
        public string SocialNetworkUrl { get; set; }

        public virtual SocialNetwork SocialNetwork { get; set; }
        public virtual User User { get; set; }
    }
}
