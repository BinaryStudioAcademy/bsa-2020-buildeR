using AutoMapper;

using buildeR.Common.DTO.Project;
using buildeR.DAL.Entities;

using System.Linq;

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
                .ForMember(dest => dest._Repository,
                    src => src
                        .MapFrom(project => project._Repository));
            CreateMap<NewProjectDTO, Project>();
        }
    }
}
