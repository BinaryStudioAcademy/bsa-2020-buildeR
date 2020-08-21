using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.EnvironmentVariables;
using Newtonsoft.Json;
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

        public async Task<Dictionary<string, string>> AddEnvironmenVariable(EnvironmentVariableDTO variableDTO)
        {   
            string path = variableDTO.ProjectId.ToString();
            string value = JsonConvert.SerializeObject(variableDTO.Data);
            try
            {
                var res = await _secretService.ReadSecretsAsync(path);
                if (res.ContainsKey(variableDTO.Name))
                {
                    return await UpdateEnvironmentVariable(variableDTO, res);
                }
                res.Add(variableDTO.Name, value);
                await _secretService.CreateSecretsAsync(res, path);
                return res;
            }
            catch(Exception e)
            {
                var res = new Dictionary<string, string>();
                res.Add(variableDTO.Name, value);
                await _secretService.CreateSecretsAsync(res, path);
                return res;
            }
        }

        public async Task<Dictionary<string, string>> UpdateEnvironmentVariable(EnvironmentVariableDTO variableDTO,
                                                                          Dictionary<string, string> dict)
        {
            dict[variableDTO.Name] = JsonConvert.SerializeObject(variableDTO.Data);
            await _secretService.CreateSecretsAsync(dict, variableDTO.ProjectId.ToString());
            return dict;
        }

        public Task DeleteEnvironmentVariable()
        {
            throw new NotImplementedException();
        }

        public async Task GetEnvironmentVariables(string projectId)
        {
            var res = await _secretService.ReadSecretsAsync(projectId);
        }
    }
}
