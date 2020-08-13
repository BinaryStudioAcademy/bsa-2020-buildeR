using AutoMapper;

using buildeR.Common.DTO.BuildStep;
using buildeR.DAL.Entities;

namespace buildeR.BLL.MappingProfiles
{
    public sealed class BuildStepProfile : Profile
    {
        public BuildStepProfile()
        {
            CreateMap<BuildStep, BuildStepDTO>();
            CreateMap<BuildStep, ExecutiveBuildStepDTO>()
                .ForMember(dest => dest.BuildStepId,
                    src => src.MapFrom(s => s.Id))
                .ForMember(dest => dest.Name,
                    src => src.MapFrom(s => s.BuildStepName))
                .ForMember(dest => dest.PluginCommand,
                    src => src.MapFrom(s => s.PluginCommand))
                .ForMember(dest => dest.BuildPlugin,
                    src => src.MapFrom(s => s.PluginCommand.Plugin))
                .ForMember(dest => dest.Parameters,
                    src => src.MapFrom(s => s.BuildPluginParameters));

            CreateMap<BuildStepDTO, BuildStep>();
            CreateMap<NewBuildStepDTO, BuildStep>();
        }
    }
}
