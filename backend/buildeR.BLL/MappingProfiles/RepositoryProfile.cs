using AutoMapper;
using buildeR.Common.DTO.Repository;
using buildeR.DAL.Entities;

namespace buildeR.BLL.MappingProfiles
{
    public class RepositoryProfile: Profile
    {
        public RepositoryProfile()
        {
            CreateMap<Repository, RepositoryDTO>();
            CreateMap<NewRepositoryDTO, Repository>();
            CreateMap<RepositoryDTO, Repository>();
        }
    }
}
