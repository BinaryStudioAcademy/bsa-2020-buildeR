namespace buildeR.Common.DTO.UserSocialNetwork
{
    public sealed class NewUserSocialNetworkDTO
    {
        public int UserId { get; set; }
        public int SocialNetworkId { get; set; }
        public string SocialNetworkUrl { get; set; }
        public string UId { get; set; }
        public string AccessToken { get; set; }
    }
}
