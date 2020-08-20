using buildeR.Common.Enums;
using buildeR.DAL.Entities.Common;

namespace buildeR.DAL.Entities
{
    public class UserSocialNetwork: Entity
    {
        public int UserId { get; set; }
        public Provider ProviderName { get; set; }
        public string SocialNetworkUrl { get; set; }
        public string UId { get; set; }

        public virtual User User { get; set; }
    }
}
