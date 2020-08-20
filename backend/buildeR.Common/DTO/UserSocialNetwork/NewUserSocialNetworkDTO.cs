using buildeR.Common.Enums;

namespace buildeR.Common.DTO.UserSocialNetwork
{
    public sealed class NewUserSocialNetworkDTO
    {
        public int UserId { get; set; }
        public Provider ProviderName { get; set; }
        public string SocialNetworkUrl { get; set; }
        public string UId { get; set; }
    }
}
