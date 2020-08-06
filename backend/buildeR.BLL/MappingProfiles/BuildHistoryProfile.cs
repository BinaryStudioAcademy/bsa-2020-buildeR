using AutoMapper;

using buildeR.Common.DTO.BuildHistory;
using buildeR.DAL.Entities;

namespace buildeR.BLL.MappingProfiles
{
    public sealed class BuildHistoryProfile : Profile
    {
        public BuildHistoryProfile()
        {
            CreateMap<BuildHistory, BuildHistoryDTO>();

            CreateMap<BuildHistoryDTO, BuildHistory>();
            CreateMap<NewBuildHistoryDTO, BuildHistory>();
        }
    }
}
