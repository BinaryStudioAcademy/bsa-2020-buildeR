using buildeR.Common.DTO.BuildHistory;
using buildeR.Common.DTO.Repository;
using buildeR.Common.DTO.User;

namespace buildeR.Common.DTO.Project
{
    public sealed class ProjectInfoDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsFavorite { get; set; }
        public BuildHistoryDTO LastBuildHistory { get; set; }
        public UserDTO Owner { get; set; }
        public RepositoryDTO Repository { get; set; }
    }
}
