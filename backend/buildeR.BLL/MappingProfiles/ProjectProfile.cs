using AutoMapper;

using buildeR.Common.DTO.Project;
using buildeR.DAL.Entities;

using System.Linq;
using System.Security.Cryptography;

namespace buildeR.BLL.MappingProfiles
{
    public sealed class ProjectProfile : Profile
    {
        public ProjectProfile()
        {
            CreateMap<Project, ProjectDTO>();
            CreateMap<Project, ProjectInfoDTO>()
                .ForMember(dest => dest.LastBuildHistory,
                    src => src
                        .MapFrom(project => project
                            .BuildHistories
                            .OrderByDescending(prj => prj.BuildAt)
                            .FirstOrDefault()));

            CreateMap<ProjectDTO, Project>()
                .ForMember(dest => dest.Owner,
                    src => src.MapFrom(project => project
                    .Owner))
                .ForMember(dest => dest._Repository,
                   src => src
                   .MapFrom(project => project
                   ._Repository))
                .ForMember(dest => dest.ProjectGroups,
                src => src.Ignore())
                .ForMember(dest => dest.BuildHistories,
                   src => src
                   .MapFrom(project => project
                   .BuildHistories))
                .ForMember(dest => dest.BuildSteps,
                   src => src
                   .MapFrom(project => project
                   .BuildSteps))
                .ForMember(dest => dest.ProjectTriggers,
                   src => src
                   .MapFrom(project => project
                   .ProjectTriggers));



            CreateMap<NewProjectDTO, Project>();
        }
    }
}
