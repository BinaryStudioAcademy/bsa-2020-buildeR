using AutoMapper;

using buildeR.Common.DTO.Project;
using buildeR.DAL.Entities;

namespace buildeR.BLL.MappingProfiles
{
    public sealed class ProjectProfile : Profile
    {
        public ProjectProfile()
        {
            CreateMap<Project, ProjectDTO>();

            CreateMap<ProjectDTO, Project>();
            CreateMap<NewProjectDTO, Project>();
        }
    }
}
