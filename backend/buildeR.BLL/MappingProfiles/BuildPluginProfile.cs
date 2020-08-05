using AutoMapper;

using buildeR.Common.DTO.BuildPlugin;
using buildeR.DAL.Entities;

namespace buildeR.BLL.MappingProfiles
{
    public sealed class BuildPluginProfile : Profile
    {
        public BuildPluginProfile()
        {
            CreateMap<BuildPlugin, BuildPluginDTO>();

            CreateMap<BuildPluginDTO, BuildPlugin>();
            CreateMap<NewBuildPluginDTO, BuildPlugin>();
        }
    }
}
