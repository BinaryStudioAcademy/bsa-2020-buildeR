namespace buildeR.BLL.Services
{
    //public class GroupInviteService : BaseCrudService<GroupInvite, GroupInviteDTO, NewGroupInviteDTO>, IGroupInviteService
    //{
    //    private readonly ITeamMemberService _teamMemberService;
    //    public GroupInviteService(BuilderContext context, IMapper mapper, ITeamMemberService teamMemberService) : base(context, mapper) 
    //    {
    //        _teamMemberService = teamMemberService;
    //    }

    //    public async Task<GroupInviteDTO> Create(NewGroupInviteDTO groupInvite)
    //    {
    //        if(groupInvite == null)
    //        {
    //            throw new ArgumentNullException();
    //        }
    //        groupInvite.CreatedAt = DateTime.Now;

    //        return await base.AddAsync(groupInvite);
    //    }

    //    public async Task<IEnumerable<GroupInviteDTO>> GetGroupInvitesByUserId(int userId)
    //    {
    //        var groupInvites = await Context.GroupInvites.Include(g => g.FromUser).Include(g => g.Group)
    //                                        .Where(g => g.ToUserId == userId && !g.IsAccepted).ToListAsync();

    //        return Mapper.Map<IEnumerable<GroupInviteDTO>>(groupInvites);
    //    }

    //    public async Task Update(GroupInviteDTO groupInvite)
    //    {
    //        if (groupInvite == null)
    //        {
    //            throw new ArgumentNullException();
    //        }
    //        await base.UpdateAsync(groupInvite);
    //    }

    //    public async Task AcceptGroupInvite(int id)
    //    {
    //        var groupInvite = await GetGroupInviteById(id);

    //        groupInvite.IsAccepted = true;
    //        await Update(groupInvite);

    //        NewTeamMemberDTO newTeamMemberDTO = new NewTeamMemberDTO
    //        {
    //            UserId = groupInvite.ToUserId,
    //            GroupId = groupInvite.GroupId
    //            //add role
    //        };
    //        await _teamMemberService.Create(newTeamMemberDTO);
    //    }

    //    public async Task<GroupInviteDTO> GetGroupInviteById(int id)
    //    {
    //        var groupInvite = await base.GetAsync(id);
    //        if (groupInvite == null)
    //        {
    //            throw new NotFoundException(nameof(GroupInvite), id);
    //        }
    //        return await base.GetAsync(id);
    //    }

    //    public async Task Delete(int id)
    //    {
    //        var groupInvite = await base.GetAsync(id);
    //        if (groupInvite == null)
    //        {
    //            throw new NotFoundException(nameof(GroupInvite), id);
    //        }
    //        await base.RemoveAsync(id);
    //    }
    //}
}
