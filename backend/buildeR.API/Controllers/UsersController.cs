using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO;
using buildeR.Common.DTO.User;
using buildeR.DAL.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nest;

namespace buildeR.API.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService, IFileProvider fileProvider)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ICollection<UserDTO>> Get()
        {
            return await _userService.GetAll();
        }

        [HttpGet("{id}")]
        public async Task<UserDTO> Get(int id)
        {
            return await _userService.GetUserById(id);
        }

        [AllowAnonymous]
        [HttpGet("login/{UId}")]
        public async Task<UserDTO> Login(string UId)
        {
            return await _userService.Login(UId);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<UserDTO> Register([FromBody] NewUserDTO user)
        {
            return await _userService.Register(user);
        }

        [AllowAnonymous]
        [HttpPost("validate-username")]
        public async Task<bool> ValidateUsername([FromBody] ValidateUserDTO user)
        {
            return await _userService.ValidateUsername(user);
        }

        [HttpPut]
        public async Task<UserDTO> Update([FromBody] UserDTO user)
        {
            return await _userService.Update(user);
        }
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _userService.Delete(id);
        }

        [AllowAnonymous]
        [HttpPost("link-provider")]
        public async Task<UserDTO> LinkProvider([FromBody] LinkProviderDTO user)
        {
            return await _userService.LinkProvider(user);
        }

        [HttpPost("avatar/{id}")]
        public async Task<UserDTO> UpdateAvatar(int id)
        {
            return await _userService.UpdateUserAvatar(Request.Form.Files[0], id);
        }
        
        [AllowAnonymous]
        [HttpPost("letter")]
        public async Task AddUserLetter([FromBody] UserLetterDTO userLetter)
        {
            await _userService.AddUserLetter(userLetter);
        }

        [HttpGet("letters")]
        public async Task<ICollection<UserLetterDTO>> GetAllUserLetters()
        {
            Console.WriteLine("tyta");
            return await _userService.GetAllUserLetters();
        }
        
        [HttpPut("letters/send")]
        public async Task SendLetterToUser([FromBody] UserLetterAnswerDTO userLetter)
        {
            await _userService.SendLetterToUser(userLetter);
        }
        
        [HttpPut("letter")]
        public async Task UpdateUserLetter([FromBody] UserLetterDTO userLetter)
        {
            await _userService.UpdateUserLetter(userLetter);
        }
    }   
}