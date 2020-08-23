using buildeR.Common.DTO.EnvironmentVariables;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IEnvironmentVariablesService
    {
        Task<Dictionary<string, string>> AddEnvironmenVariable(EnvironmentVariableDTO variableDTO);
        Task DeleteEnvironmentVariable();
        Task<List<EnvironmentVariableDTO>> GetEnvironmentVariables(string projectId);


    }
}
