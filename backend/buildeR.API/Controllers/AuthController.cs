using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.User;
using buildeR.Common.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace buildeR.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        public AuthController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpGet]
        public async Task<ActionResult<UserDTO>> GetUserFromToken()
        {
            return await _userService.GetUserById(1);//just for testing purpose
        }
    }
}