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

            var inviterUsername = (await _context.Users.FirstOrDefaultAsync(u => u.Id == teamMember.InitiatorId)).Username;
            var groupName = (await _context.Groups.FirstOrDefaultAsync(g => g.Id == teamMember.GroupId)).Name;

            await _notificationsService.Create(new NewNotificationDTO
            {
                Message = $"{inviterUsername} invites you to join group {groupName}",
                Date = DateTime.Now,
                Type = NotificationType.Group,
                UserId = teamMember.UserId,
                ItemId = -1 // after click on notification user will see Groups page
            });

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

            var groupName = (await _context.Groups.FirstOrDefaultAsync(g => g.Id == teamMember.GroupId)).Name;
            var memberUsername = (await _context.Users.FirstOrDefaultAsync(u => u.Id == memberUserId)).Username;

            if (teamMember.InitiatorUserId == memberUserId)
            {
                if (!memberIsAccepted)
                {
                    var members = await _context.TeamMembers.Where(t => t.GroupId == teamMember.GroupId 
                        && (t.MemberRole == GroupRole.Admin || t.MemberRole == GroupRole.Owner)).ToListAsync();
                    foreach (var memb in members)
                    {
                        await _notificationsService.Create(new NewNotificationDTO
                        {
                            Message = $"{memberUsername} declined the invitation to group {groupName}",
                            Date = DateTime.Now,
                            Type = NotificationType.Group,
                            UserId = memb.UserId,
                            ItemId = teamMember.GroupId
                        });
                    }
                }
                else
                {
                    var members = await _context.TeamMembers.Where(t => t.GroupId == teamMember.GroupId).ToListAsync();
                    foreach (var memb in members)
                    {
                        await _notificationsService.Create(new NewNotificationDTO
                        {
                            Message = $"{memberUsername} left group {groupName}",
                            Date = DateTime.Now,
                            Type = NotificationType.Group,
                            UserId = memb.UserId,
                            ItemId = memb.GroupId
                        });
                    }
                }
            }
            else
            {
                var initiatorUsername = (await _context.Users.FirstOrDefaultAsync(u => u.Id == teamMember.InitiatorUserId)).Username;
                var members = await _context.TeamMembers.Where(t => t.GroupId == teamMember.GroupId && t.UserId != teamMember.InitiatorUserId).ToListAsync();
                foreach (var memb in members)
                {
                    await _notificationsService.Create(new NewNotificationDTO
                    {
                        Message = $"{initiatorUsername} removed {memberUsername} from group {groupName}",
                        Date = DateTime.Now,
                        Type = NotificationType.Group,
                        UserId = memb.UserId,
                        ItemId = teamMember.GroupId
                    });
                }
                await _notificationsService.Create(new NewNotificationDTO
                {
                    Message = $"{initiatorUsername} removed you from group {groupName}",
                    Date = DateTime.Now,
                    Type = NotificationType.Group,
                    UserId = memberUserId,
                    ItemId = -1
                });
            }
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
            await base.UpdateAsync(teamMember);

            if (teamMember.MemberRole != GroupRole.Owner)
            {
                var groupName = (await _context.Groups.FirstOrDefaultAsync(g => g.Id == teamMember.GroupId)).Name;
                if (teamMember.IsAccepted && !memberBeforeUpdate.IsAccepted)
                {
                    var members = await _context.TeamMembers.Where(t => t.GroupId == memberBeforeUpdate.GroupId && t.Id != teamMember.Id).ToListAsync();
                    foreach (var member in members)
                    {
                        await _notificationsService.Create(new NewNotificationDTO
                        {
                            Message = $"{teamMember.User.Username} joined group {groupName}",
                            Date = DateTime.Now,
                            Type = NotificationType.Group,
                            UserId = member.UserId,
                            ItemId = teamMember.GroupId
                        });
                    }
                }
                else if (teamMember.MemberRole != memberBeforeUpdate.MemberRole)
                {
                    var initiatorUsername = (await _context.Users.FirstOrDefaultAsync(u => u.Id == teamMember.InitiatorId)).Username;
                    if (teamMember.InitiatorId != teamMember.UserId)
                    {
                        await _notificationsService.Create(new NewNotificationDTO
                        {
                            Message = $"{initiatorUsername} changed your role to {Enum.GetName(typeof(GroupRole), teamMember.MemberRole)} in group {groupName}",
                            Date = DateTime.Now,
                            Type = NotificationType.Group,
                            UserId = teamMember.Id,
                            ItemId = teamMember.GroupId
                        });
                    }
                }
            }
        }
    }
}
