using AutoMapper;

using buildeR.Common.DTO.SocialNetwork;
using buildeR.DAL.Entities;

namespace buildeR.BLL.MappingProfiles
{
    public sealed class SocialNetworkProfile : Profile
    {
        public SocialNetworkProfile()
        {
            CreateMap<SocialNetwork, SocialNetworkDTO>();

            CreateMap<SocialNetworkDTO, SocialNetwork>();
            CreateMap<NewSocialNetworkDTO, SocialNetwork>();
        }
    }
}
