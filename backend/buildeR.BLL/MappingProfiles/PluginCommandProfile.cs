using AutoMapper;

using buildeR.Common.DTO.PluginCommand;
using buildeR.DAL.Entities;

namespace buildeR.BLL.MappingProfiles
{
    public sealed class PluginCommandProfile : Profile
    {
        public PluginCommandProfile()
        {
            CreateMap<PluginCommand, PluginCommandDTO>();

            CreateMap<PluginCommandDTO, PluginCommand>();
            CreateMap<NewPluginCommandDTO, PluginCommand>();
        }
    }
}
