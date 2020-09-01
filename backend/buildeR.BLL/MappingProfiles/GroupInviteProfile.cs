using AutoMapper;
using buildeR.Common.DTO.GroupInvite;
using buildeR.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.BLL.MappingProfiles
{
    public class GroupInviteProfile : Profile
    {
        public GroupInviteProfile()
        {
            CreateMap<GroupInvite, GroupInviteDTO>();

            CreateMap<GroupInviteDTO, GroupInvite>();
            CreateMap<NewGroupInviteDTO, GroupInvite>();
        }
    }
}
