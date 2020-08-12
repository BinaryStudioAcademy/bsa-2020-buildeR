using AutoMapper;
using buildeR.BLL.Exceptions;
using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.Group;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class GroupService : BaseCrudService<Group, GroupDTO, NewGroupDTO>, IGroupService
    {
        public GroupService(BuilderContext context, IMapper mapper) : base(context, mapper)
        {
        }
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
        public async Task<GroupDTO> Create(NewGroupDTO group)
        {
            if (group == null)
            {
                throw new ArgumentNullException();
            }
            return await base.AddAsync(group);
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
    }
}
