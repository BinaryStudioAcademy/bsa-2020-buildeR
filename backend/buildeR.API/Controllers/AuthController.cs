using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using buildeR.Common.DTO.User;
using buildeR.Common.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace buildeR.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class AuthController : ControllerBase
    {
        [HttpGet]
        public ActionResult<UserDTO> GetUserFromToken()
        {
            return Ok(new UserDTO()
            {
                Id = 1,
                Role = UserRole.Creator,
                Email = "buildeR@gmail.com",
                Username = "buildeR",
                AvatarUrl = null,
                FirstName = "Build",
                LastName = "R",
                Bio = ""
            });
        }
    }
}
