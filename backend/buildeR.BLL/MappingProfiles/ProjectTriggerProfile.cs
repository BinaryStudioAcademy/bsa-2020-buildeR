using AutoMapper;

using buildeR.Common.DTO.ProjectTrigger;
using buildeR.Common.DTO.Quartz;
using buildeR.DAL.Entities;
using System;

namespace buildeR.BLL.MappingProfiles
{
    public sealed class ProjectTriggerProfile : Profile
    {
        public ProjectTriggerProfile()
        {
            CreateMap<ProjectTrigger, ProjectTriggerDTO>();

            CreateMap<ProjectTriggerDTO, ProjectTrigger>();
            CreateMap<NewProjectTriggerDTO, ProjectTrigger>();

            CreateMap<ProjectTriggerDTO, QuartzDTO>()
                .ForMember(q => q.Id, opt => opt.MapFrom(p => p.Id.ToString()))
                .ForMember(q => q.Group, opt => opt.MapFrom(p => p.ProjectId.ToString()))
                .ForMember(q => q.Description, opt => opt.MapFrom(p => p.BranchHash));

            CreateMap<QuartzInfoDTO, ProjectTriggerInfoDTO>()
                .ForMember(p => p.Id, opt => opt.MapFrom(q => Convert.ToInt32(q.Id)))
                .ForMember(p => p.ProjectId, opt => opt.MapFrom(q => Convert.ToInt32(q.Group)))
                .ForMember(p => p.BranchHash, opt => opt.MapFrom(q => q.Description));
        }
    }
}
