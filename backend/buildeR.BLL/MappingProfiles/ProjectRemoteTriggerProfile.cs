using AutoMapper;
using buildeR.Common.DTO.ProjectRemoteTrigger;
using buildeR.DAL.Entities;

namespace buildeR.BLL.MappingProfiles
{
    public class ProjectRemoteTriggerProfile: Profile
    {
        public ProjectRemoteTriggerProfile()
        {
            CreateMap<NewProjectRemoteTriggerDTO, ProjectRemoteTrigger>();
            CreateMap<ProjectRemoteTrigger, ProjectRemoteTriggerDTO>();
        }
    }
}
