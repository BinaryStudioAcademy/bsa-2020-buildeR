using AutoMapper;
using buildeR.BLL.Exceptions;
using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.Group;
using buildeR.Common.DTO.TeamMember;
using buildeR.Common.Enums;
using buildeR.Common.DTO.Project;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class GroupService : BaseCrudService<Group, GroupDTO, NewGroupDTO>, IGroupService
    {
        public GroupService(BuilderContext context, IMapper mapper) : base(context, mapper) {}

        public async Task<GroupDTO> GetGroupById(int id)
        {
            var group = await base.GetAsync(id);
            if (group == null)
            {
                throw new NotFoundException(nameof(Group), id);
            }
            return await base.GetAsync(id);
        }
        public async Task<IEnumerable<GroupDTO>> GetAll()
        {
            return await base.GetAllAsync();
        }
        public async Task<IEnumerable<GroupDTO>> GetGroupsWithMembersAndProjects()
        {
            var groups = await Context.Groups.Include(g => g.TeamMembers)
                                                .Include(g => g.ProjectGroups).ToListAsync();
            return Mapper.Map<IEnumerable<GroupDTO>>(groups);
        }
        public async Task<GroupDTO> Create(NewGroupDTO group)
        {
            if (group == null)
            {
                throw new ArgumentNullException();
            }

            var newGroup = await base.AddAsync(group);

            var teamMember = new TeamMember
            {
                UserId = group.CreatorId,
                MemberRole = UserRole.Creator,
                GroupId = newGroup.Id,
                JoinedDate = DateTime.Now
            };
            Context.Add(teamMember);
            await Context.SaveChangesAsync();

            return await GetGroupById(newGroup.Id);
        }
        public async Task Update(GroupDTO group)
        {
            if (group == null)
            {
                throw new ArgumentNullException();
            }
            await base.UpdateAsync(group);
        }
        public async Task Delete(int id)
        {
            var group = await base.GetAsync(id);
            if (group == null)
            {
                throw new NotFoundException(nameof(Group), id);
            }
            await base.RemoveAsync(id);
        }

        public async Task<IEnumerable<ProjectInfoDTO>> GetGroupProjects(int id)
        {
            var group = await Context.Groups.AsNoTracking().Include(g => g.ProjectGroups).ThenInclude(p=>p.Project)
                .Include(g => g.TeamMembers).FirstOrDefaultAsync(g => g.Id == id);
            var projects = group.ProjectGroups.Select(x => x.Project);
            var projectInfos = Mapper.Map<IEnumerable<ProjectInfoDTO>>(projects);
            return projectInfos;
        }

        public async Task<IEnumerable<TeamMemberDTO>> GetGroupMembers(int id)
        {
            var group = await Context.Groups.AsNoTracking().Include(g => g.TeamMembers).ThenInclude(m=>m.User).FirstOrDefaultAsync(g => g.Id == id);
           // var users = group.TeamMembers.Select(m => m.User);
            var members = Mapper.Map<IEnumerable<TeamMemberDTO>>(group.TeamMembers);
            return members;
        }
    }
}
