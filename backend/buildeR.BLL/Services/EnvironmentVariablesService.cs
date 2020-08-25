using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.EnvironmentVariables;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
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

        public async Task AddEnvironmenVariable(EnvironmentVariableDTO variableDTO)
        {   
            string path = variableDTO.ProjectId.ToString();
            string value = JsonConvert.SerializeObject(variableDTO.Data);
            try
            {
                var res = await _secretService.ReadSecretsAsync(path);
                //To avoid name duplicates
                if (res.ContainsKey(variableDTO.Id))
                {
                    await UpdateEnvironmentVariable(variableDTO, res);
                    return;
                }
                res.Add(variableDTO.Id, value);
                await _secretService.CreateSecretsAsync(res, path);
            }
            catch(Exception e)
            {
                var res = new Dictionary<string, string>();
                res.Add(variableDTO.Id, value);
                await _secretService.CreateSecretsAsync(res, path);
            }
        }

        public async Task UpdateEnvironmentVariable(EnvironmentVariableDTO variableDTO,
                                                                          Dictionary<string, string> dict = null)
        {
            if (dict == null)
            {
                dict = await _secretService.ReadSecretsAsync(variableDTO.ProjectId.ToString());
            }
            dict[variableDTO.Id] = JsonConvert.SerializeObject(variableDTO.Data);
            await _secretService.CreateSecretsAsync(dict, variableDTO.ProjectId.ToString());
        }

        public async Task DeleteEnvironmentVariable(EnvironmentVariableDTO variableDTO)
        {
            string path = variableDTO.ProjectId.ToString();
            var res = await _secretService.ReadSecretsAsync(path);
            res.Remove(variableDTO.Id);
            await _secretService.CreateSecretsAsync(res, path);
        }

        public async Task<List<EnvironmentVariableDTO>> GetEnvironmentVariables(string projectId)
        {
            var dict = await _secretService.ReadSecretsAsync(projectId);
            List<EnvironmentVariableDTO> res = new List<EnvironmentVariableDTO>();
            foreach (var item in dict)
            {
                EnvironmentVariableDTO dto = new EnvironmentVariableDTO();
                dto.ProjectId = Convert.ToInt32(projectId);
                dto.Id = item.Key;
                dto.Data = JsonConvert.DeserializeObject<VariableValue>(item.Value);
                res.Add(dto);
            }
            return res;
        }
    }
}
