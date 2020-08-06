using AutoMapper;

using buildeR.Common.DTO.ProjectGroup;
using buildeR.DAL.Entities;

namespace buildeR.BLL.MappingProfiles
{
    public sealed class ProjectGroupProfile : Profile
    {
        public ProjectGroupProfile()
        {
            CreateMap<ProjectGroup, ProjectGroupDTO>();

            CreateMap<ProjectGroupDTO, ProjectGroup>();
            CreateMap<NewProjectGroupDTO, ProjectGroup>();
        }
    }
}
