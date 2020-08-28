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
                            .OrderByDescending(prj => prj.Number)
                            .FirstOrDefault()));

            CreateMap<ProjectDTO, Project>()
                .ForMember(dest => dest.Repository,
                    src => src
                        .MapFrom(project => project.Repository));
            CreateMap<NewProjectDTO, Project>();
        }
    }
}
