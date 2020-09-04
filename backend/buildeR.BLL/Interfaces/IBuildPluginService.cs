using buildeR.Common.DTO.BuildPlugin;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IBuildPluginService
    {
        Task<IEnumerable<string>> GetVersionsOfBuildPlugin(string buildPluginName, string partOfVersionWord);
        Task<BuildPluginDTO> GetPluginById(int id);
        Task<IEnumerable<BuildPluginDTO>> GetAll();
        Task<BuildPluginDTO> Create(NewBuildPluginDTO buildPlugin);
        Task Update(BuildPluginDTO buildPlugin);
        Task Delete(int id);
    }
}
