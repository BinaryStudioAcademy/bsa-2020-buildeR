using buildeR.Common.DTO.EnvironmentVariables;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IEnvironmentVariablesService
    {
        Task AddEnvironmenVariable(EnvironmentVariableDTO variableDTO);
        Task DeleteEnvironmentVariable(EnvironmentVariableDTO path);
        Task<List<EnvironmentVariableDTO>> GetEnvironmentVariables(string projectId);
        Task UpdateEnvironmentVariable(EnvironmentVariableDTO variableDTO, Dictionary<string, string> dict = null);

    }
}
