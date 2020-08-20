using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.BuildStep;

using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IBuildStepService : ICrudService<BuildStepDTO, NewBuildStepDTO, int>
    {
        Task<BuildStepDTO> GetBuildStepById(int id);
        Task<IEnumerable<BuildStepDTO>> GetAll();
        Task<BuildStepDTO> Create(NewBuildStepDTO buildStep);
        Task Update(BuildStepDTO buildStep);
        Task Delete(int id);

        Task<IEnumerable<EmptyBuildStepDTO>> GetEmptyBuildStepsAsync();
        Task<IEnumerable<BuildStepDTO>> GetBuildStepsByProjectIdAsync(int projectId);
        Task UpdateIndexesOfBuildStepsAsync(int projectId, int newIndex, int oldIndex);
    }
}
