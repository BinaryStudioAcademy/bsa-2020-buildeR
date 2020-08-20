using buildeR.Common.DTO.Project;
using buildeR.Common.DTO.TeamMember;
using buildeR.Common.DTO.UserSocialNetwork;
using buildeR.Common.Enums;
using System;
using System.Collections;
using System.Collections.Generic;

namespace buildeR.Common.DTO.User
{
    public sealed class UserDTO
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public UserRole Role { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string AvatarUrl { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Bio { get; set; }
        
        public ICollection<ProjectDTO> Projects { get; set; }
        public ICollection<TeamMemberDTO> TeamMembers { get; set; }
        public ICollection<UserSocialNetworkDTO> UserSocialNetworks { get; set; }
    }
}
