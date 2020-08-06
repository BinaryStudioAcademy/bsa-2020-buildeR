using AutoMapper;

using buildeR.Common.DTO.BuildPluginParameter;
using buildeR.DAL.Entities;

namespace buildeR.BLL.MappingProfiles
{
    public sealed class BuildPluginParameterProfile : Profile
    {
        public BuildPluginParameterProfile()
        {
            CreateMap<BuildPluginParameter, BuildPluginParameterDTO>();

            CreateMap<BuildPluginParameterDTO, BuildPluginParameter>();
            CreateMap<NewBuildPluginParameterDTO, BuildPluginParameter>();
        }
    }
}
