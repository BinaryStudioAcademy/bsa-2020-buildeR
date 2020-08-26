using AutoMapper;

using buildeR.Common.DTO;
using buildeR.DAL.Entities;

namespace buildeR.BLL.MappingProfiles
{
    public sealed class CommandArgumentProfile : Profile
    {
        public CommandArgumentProfile()
        {
            CreateMap<CommandArgument, CommandArgumentDTO>();
            CreateMap<CommandArgumentDTO, CommandArgument>();
        }
    }
}
