using AutoMapper;

using buildeR.Common.DTO.UserSocialNetwork;
using buildeR.DAL.Entities;

namespace buildeR.BLL.MappingProfiles
{
    public sealed class UserSocialNetworkProfile : Profile
    {
        public UserSocialNetworkProfile()
        {
            CreateMap<UserSocialNetwork, UserSocialNetworkDTO>();

            CreateMap<UserSocialNetworkDTO, UserSocialNetwork>();
            CreateMap<NewUserSocialNetworkDTO, UserSocialNetwork>();
        }
    }
}
