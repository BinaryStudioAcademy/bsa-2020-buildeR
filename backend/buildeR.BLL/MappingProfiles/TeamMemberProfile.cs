using AutoMapper;

using buildeR.Common.DTO.TeamMember;
using buildeR.DAL.Entities;

namespace buildeR.BLL.MappingProfiles
{
    public sealed class TeamMemberProfile : Profile
    {
        public TeamMemberProfile()
        {
            CreateMap<TeamMember, TeamMemberDTO>();

            CreateMap<TeamMemberDTO, TeamMember>();
            CreateMap<NewTeamMemberDTO, TeamMember>();
        }
    }
}
