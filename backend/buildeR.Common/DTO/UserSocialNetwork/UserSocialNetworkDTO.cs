using buildeR.Common.DTO.SocialNetwork;
using buildeR.Common.DTO.User;

namespace buildeR.Common.DTO.UserSocialNetwork
{
    public sealed class UserSocialNetworkDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int SocialNetworkId { get; set; }
        public string SocialNetworkUrl { get; set; }
        public string UId { get; set; }

        public SocialNetworkDTO SocialNetwork { get; set; }
    }
}
