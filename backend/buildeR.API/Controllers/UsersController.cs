using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.User;
using buildeR.DAL.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace buildeR.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<UserDTO>>> Get()
        {
            return Ok(await _userService.GetAll());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ICollection<UserDTO>>> Get(int id)
        {
            return Ok(await _userService.GetUserById(id));
        }

        [HttpPost]
        public async Task<ActionResult<UserDTO>> Create([FromBody] UserDTO user)
        {
            return Created("", await _userService.Create(user));
        }

        [HttpPut]
        public async Task<ActionResult<UserDTO>> Update([FromBody] UserDTO user)
        {
            return Ok(await _userService.Update(user));
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult>Delete(int id)
        {
            await _userService.Delete(id);
            return Ok();
        }
    }
}