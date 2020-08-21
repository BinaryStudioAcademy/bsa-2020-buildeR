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

            CreateMap<BuildStepDTO, BuildStep>();
            CreateMap<NewBuildStepDTO, BuildStep>();
        }
    }
}
