using AutoMapper;

using buildeR.Common.DTO.ProjectTrigger;
using buildeR.DAL.Entities;

namespace buildeR.BLL.MappingProfiles
{
    public sealed class ProjectTriggerProfile : Profile
    {
        public ProjectTriggerProfile()
        {
            CreateMap<ProjectTrigger, ProjectTriggerDTO>();

            CreateMap<ProjectTriggerDTO, ProjectTrigger>();
            CreateMap<NewProjectTriggerDTO, ProjectTrigger>();
        }
    }
}
