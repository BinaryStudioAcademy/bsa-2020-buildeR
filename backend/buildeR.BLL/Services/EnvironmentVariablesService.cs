using buildeR.BLL.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class EnvironmentVariablesService : IEnvironmentVariablesService
    {
        private readonly ISecretService _secretService;

        public EnvironmentVariablesService(ISecretService secretService)
        {
            _secretService = secretService;
        }

        public Task AddEnvironmenVariable()
        {
            throw new NotImplementedException();
        }

        public Task DeleteEnvironmentVariable()
        {
            throw new NotImplementedException();
        }

        public Task GetEnvironmentVariables(string projectId)
        {
            throw new NotImplementedException();
        }
    }
}
