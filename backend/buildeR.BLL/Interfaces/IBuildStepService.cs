using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.BuildStep;
using System;
using System.Collections.Generic;
using System.Text;
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
    }
}
