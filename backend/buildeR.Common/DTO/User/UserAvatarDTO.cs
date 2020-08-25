using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.Common.DTO.User
{
    public class UserAvatarDTO
    {
        public int UserId { get; set; }
        public IFormFile Avatar { get; set; }
    }
}
