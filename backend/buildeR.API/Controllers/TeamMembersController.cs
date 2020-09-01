using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.TeamMember;
using buildeR.Common.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace buildeR.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TeamMembersController : ControllerBase
    {
        private readonly ITeamMemberService _teamMemberService;
        public TeamMembersController(ITeamMemberService teamMemberService)
        {
            _teamMemberService = teamMemberService;
        }
        [HttpPost]
        public async Task<TeamMemberDTO> Create(NewTeamMemberDTO teamMember)
        {
            return await _teamMemberService.Create(teamMember);
        }
        [HttpPut]
        public async Task UpdateMember(TeamMemberDTO teamMember)
        {
            await _teamMemberService.Update(teamMember);
        }

        [HttpDelete("{id}")]
        public async Task DeleteMember(int id)
        {
            await _teamMemberService.Delete(id);
        }
    }
}