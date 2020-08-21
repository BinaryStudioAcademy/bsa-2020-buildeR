using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IEnvironmentVariablesService
    {
        Task AddEnvironmenVariable();
        Task DeleteEnvironmentVariable();
        Task GetEnvironmentVariables(string projectId);

    }
}
