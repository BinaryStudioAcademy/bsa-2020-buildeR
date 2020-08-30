using AutoMapper;
using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.TeamMember;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class TeamMemberService : BaseCrudService<TeamMember, TeamMemberDTO, NewTeamMemberDTO>, ITeamMemberService
    {
        public TeamMemberService(BuilderContext context, IMapper mapper) : base(context, mapper) { }
        public async Task<TeamMemberDTO> Create(NewTeamMemberDTO teamMember)
        {
            if (teamMember == null)
            {
                throw new ArgumentNullException();
            }
            teamMember.JoinedDate = DateTime.Now;
            return await base.AddAsync(teamMember);
        }

        public Task Delete(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<TeamMemberDTO>> GetAll()
        {
            throw new NotImplementedException();
        }

        public Task<TeamMemberDTO> GetById(int id)
        {
            return base.GetAsync(id);
        }

        public async Task Update(TeamMemberDTO teamMember)
        {
            if (teamMember == null)
            {
                throw new ArgumentNullException();
            }
            await base.UpdateAsync(teamMember);
        }
    }
}
