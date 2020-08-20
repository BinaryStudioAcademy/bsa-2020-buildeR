using buildeR.Common.Enums;

namespace buildeR.Common.DTO.UserSocialNetwork
{
    public sealed class UserSocialNetworkDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public Provider ProviderName { get; set; }
        public string SocialNetworkUrl { get; set; }
        public string UId { get; set; }
    }
}
