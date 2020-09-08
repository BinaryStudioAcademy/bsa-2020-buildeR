using AutoMapper;
using buildeR.BLL.Exceptions;
using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.Notification;
using buildeR.Common.DTO.TeamMember;
using buildeR.Common.Enums;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class TeamMemberService : BaseCrudService<TeamMember, TeamMemberDTO, NewTeamMemberDTO>, ITeamMemberService
    {
        private readonly BuilderContext _context;
        private readonly IEmailService _emailService;
        private readonly IEmailBuilder _emailBuilder;
        private readonly IUserService _userService;
        private readonly INotificationsService _notificationsService;
        public TeamMemberService(
            BuilderContext context, 
            IMapper mapper, 
            IUserService userService, 
            IEmailBuilder emailBuilder,
            IEmailService emailService,
            INotificationsService notificationsService) : base(context, mapper) 
        {
            _context = context;
            _userService = userService;
            _emailBuilder = emailBuilder;
            _emailService = emailService;
            _notificationsService = notificationsService;
        }
        public async Task<TeamMemberDTO> Create(NewTeamMemberDTO teamMember)
        {
            if (teamMember == null)
            {
                throw new ArgumentNullException();
            }
            teamMember.JoinedDate = DateTime.Now;

            var user = await _context.Users.Include(u => u.NotificationSetting).FirstOrDefaultAsync(u => u.Id == teamMember.UserId);
            //if (user.NotificationSetting.EnableEmail)
            //{
            //    var emailModel = _emailBuilder.GetInviteGroupLetter(user.Email, user.FirstName);
            //    await _emailService.SendEmailAsync(new List<string> { emailModel.Email }, emailModel.Subject, emailModel.Title, emailModel.Body);
            //}

            var newMember = await base.AddAsync(teamMember);

            var inviter = await _context.Users.FirstOrDefaultAsync(u => u.Id == teamMember.InitiatorId);
            var group = await _context.Groups.FirstOrDefaultAsync(g => g.Id == teamMember.GroupId);

            if (inviter != null && group != null)
            {
                string msg = $"{inviter?.Username} invites you to join group {group?.Name}";
                await MakeNotificationAsync(msg, null, teamMember.UserId, -1);
            }

            return newMember;
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

        public async Task DeleteWithNotification(RemoveTeamMemberDTO teamMember)
        {
            var member = await base.GetAsync(teamMember.Id);
            int memberUserId = member.UserId;
            bool memberIsAccepted = member.IsAccepted;
            if (member == null)
            {
                throw new NotFoundException(nameof(TeamMember), teamMember.Id);
            }
            await base.RemoveAsync(teamMember.Id);

            var group = await _context.Groups.FirstOrDefaultAsync(g => g.Id == teamMember.GroupId);
            var userMember = await _context.Users.FirstOrDefaultAsync(u => u.Id == memberUserId);

            if (teamMember.InitiatorUserId == memberUserId)
            {
                await CheckIsUserAcceptedAsync(memberIsAccepted, teamMember, userMember, group);
            }
            else
            {
                var initiator = await _context.Users.FirstOrDefaultAsync(u => u.Id == teamMember.InitiatorUserId);
                var members = await _context.TeamMembers.Where(t => t.GroupId == teamMember.GroupId 
                && t.UserId != teamMember.InitiatorUserId && t.IsAccepted).ToListAsync();
                foreach (var memb in members)
                {
                    string msg = $"{initiator?.Username} removed {userMember?.Username} from group {group?.Name}";
                    await MakeNotificationAsync(msg, memb);
                }

                string message = $"{initiator?.Username} removed you from group {group?.Name}";
                await MakeNotificationAsync(message, null, memberUserId, -1);
            }
        }

        private async Task CheckIsUserAcceptedAsync(bool memberIsAccepted, RemoveTeamMemberDTO teamMember, User userMember, Group group)
        {
            if (!memberIsAccepted)
            {
                var members = await _context.TeamMembers.Where(t => t.GroupId == teamMember.GroupId && t.IsAccepted
                    && (t.MemberRole == GroupRole.Admin || t.MemberRole == GroupRole.Owner)).ToListAsync();
                foreach (var memb in members)
                {
                    string message = $"{userMember?.Username} declined the invitation to group {group?.Name}";
                    await MakeNotificationAsync(message, memb);
                }
            }
            else
            {
                var members = await _context.TeamMembers.Where(t => t.GroupId == teamMember.GroupId && t.IsAccepted).ToListAsync();
                foreach (var memb in members)
                {
                    string message = $"{userMember?.Username} left group {group?.Name}";
                    await MakeNotificationAsync(message, memb);
                }
            }
        }

        async Task MakeNotificationAsync(string Message, TeamMember memb = null, int? userId = null, int? groupId = null)
        {
            await _notificationsService.Create(new NewNotificationDTO
            {
                Message = Message,
                Date = DateTime.Now,
                Type = NotificationType.Group,
                UserId = memb != null ? memb.UserId : userId,
                ItemId = memb != null ? memb.GroupId : groupId
            });
        }

        public Task<IEnumerable<TeamMemberDTO>> GetAll()
        {
            throw new NotImplementedException();
        }

        public async Task<TeamMemberDTO> GetById(int id)
        {
            return await base.GetAsync(id, true);
        }

        public async Task Update(TeamMemberDTO teamMember)
        {
            if (teamMember == null)
            {
                throw new ArgumentNullException();
            }

            var memberBeforeUpdate = await GetById(teamMember.Id);
            var memberRole = memberBeforeUpdate.MemberRole;
            bool memberIsAccepted = memberBeforeUpdate.IsAccepted;

            await base.UpdateAsync(teamMember);

            var group = await _context.Groups.AsNoTracking().FirstOrDefaultAsync(g => g.Id == teamMember.GroupId);
            if (teamMember.IsAccepted && !memberIsAccepted && teamMember.MemberRole != GroupRole.Owner)
            {
                var members = await _context.TeamMembers.AsNoTracking().Where(t => t.GroupId == teamMember.GroupId 
                && t.Id != teamMember.Id && t.IsAccepted).ToListAsync();
                foreach (var member in members)
                {
                    string message = $"{teamMember?.User?.Username} joined group {group?.Name}";
                    await MakeNotificationAsync(message, member);
                }
            }
            else if (teamMember.MemberRole != memberRole && teamMember.InitiatorId != teamMember.UserId
                && teamMember.MemberRole != GroupRole.Owner)
            {
                var initiator = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == teamMember.InitiatorId);

                string message = $"{initiator?.Username} changed your role to " +
                    $"{Enum.GetName(typeof(GroupRole), teamMember.MemberRole)} in group {group?.Name}";
                await MakeNotificationAsync(message, null, teamMember.UserId, teamMember.GroupId);
            }
        }
    }
}
