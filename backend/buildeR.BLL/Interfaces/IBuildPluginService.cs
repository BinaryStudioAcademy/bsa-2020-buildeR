using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IBuildPluginService
    {
        Task<IEnumerable<string>> GetVersionsOfBuildPlugin(string buildPluginName, string partOfVersionWord);
    }
}
