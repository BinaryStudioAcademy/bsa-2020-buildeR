using AutoMapper;

using buildeR.Common.DTO.User;
using buildeR.DAL.Entities;

namespace buildeR.BLL.MappingProfiles
{
    public sealed class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, UserDTO>();

            CreateMap<UserDTO, User>();
            CreateMap<NewUserDTO, User>();
        }
    }
}
