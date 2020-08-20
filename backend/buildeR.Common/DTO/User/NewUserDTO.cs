using buildeR.Common.DTO.UserSocialNetwork;
using buildeR.Common.Enums;
using System.Collections.Generic;

namespace buildeR.Common.DTO.User
{
    public sealed class NewUserDTO
    {
        public int Role { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AvatarUrl { get; set; }
        public string UId { get; set; }
        public Provider ProviderName { get; set; }
        public string ProviderUrl { get; set; }
        public string AccessToken { get; set; }
    }
}
