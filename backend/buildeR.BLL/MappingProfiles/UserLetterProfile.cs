using AutoMapper;
using buildeR.Common.DTO;
using buildeR.Common.DTO.User;
using buildeR.DAL.Entities;

namespace buildeR.BLL.MappingProfiles
{
    public class UserLetterProfile : Profile
    {
        public UserLetterProfile()
        {
            CreateMap<UserLetter, UserLetterDTO>();
            CreateMap<UserLetterDTO, UserLetter>();
        }
    }
}