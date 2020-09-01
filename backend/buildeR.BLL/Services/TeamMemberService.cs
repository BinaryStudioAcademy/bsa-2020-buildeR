using AutoMapper;
using buildeR.BLL.Exceptions;
using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.TeamMember;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class TeamMemberService : BaseCrudService<TeamMember, TeamMemberDTO, NewTeamMemberDTO>, ITeamMemberService
    {
        private readonly BuilderContext _context;
        private readonly IEmailService _emailService;
        private readonly IEmailBuilder _emailBuilder;
        private readonly IUserService _userService;
        public TeamMemberService(
            BuilderContext context, 
            IMapper mapper, 
            IUserService userService, 
            IEmailBuilder emailBuilder,
            IEmailService emailService) : base(context, mapper) 
        {
            _context = context;
            _userService = userService;
            _emailBuilder = emailBuilder;
            _emailService = emailService;
        }
        public async Task<TeamMemberDTO> Create(NewTeamMemberDTO teamMember)
        {
            if (teamMember == null)
            {
                throw new ArgumentNullException();
            }
            teamMember.JoinedDate = DateTime.Now;

            var user = await _context.Users.Include(u => u.NotificationSetting).FirstOrDefaultAsync(u => u.Id == teamMember.UserId);
            if (user.NotificationSetting.EnableEmail)
            {
                var emailModel = _emailBuilder.GetInviteGroupLetter(user.Email, user.FirstName);
                await _emailService.SendEmailAsync(new List<string> { emailModel.Email }, emailModel.Subject, emailModel.Title, emailModel.Body);
            }

            return await base.AddAsync(teamMember);
            

        }

        public async Task Delete(int id)
        {
            var member = await base.GetAsync(id);
            if (member == null)
            {
                throw new NotFoundException(nameof(TeamMember), id);
            }
            await base.RemoveAsync(id);
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
