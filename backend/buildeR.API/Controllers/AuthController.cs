using System;
using System.Collections.Generic;
using System.Net.Http;
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
        private readonly HttpClient _githubClient;
        public AuthController(IHttpClientFactory httpClient)
        {
            _githubClient = httpClient.CreateClient("github");
        }

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

        [AllowAnonymous]
        [HttpPost("github/{code}")]
        public async Task<ActionResult<string>> GetGithubAuthToken(string code)
        {
            var response = await _githubClient.PostAsync("login/oauth/access_token?client_id=8a5264186aceec12eccf&client_secret=793f52f2b51019f4cc831bf503f59318b3db0bc4&code=" + code, null);
            var content = await response.Content.ReadAsStringAsync();
            var token = content.Split('=')[1].Split('&')[0];
            return Ok(token);
        }
    }
}
