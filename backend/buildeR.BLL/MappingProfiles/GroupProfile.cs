using AutoMapper;

using buildeR.Common.DTO.Group;
using buildeR.DAL.Entities;

namespace buildeR.BLL.MappingProfiles
{
    public sealed class GroupProfile : Profile
    {
        public GroupProfile()
        {
            CreateMap<Group, GroupDTO>();

            CreateMap<GroupDTO, Group>();
            CreateMap<NewGroupDTO, Group>();
        }
    }
}
