using buildeR.Common.DTO.EnvironmentVariables;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface ISecretService
    {
        Task<Dictionary<string, string>> CreateSecretsAsync(Dictionary<string, string> secrets, string path = null);
        Task<Dictionary<string, string>> ReadSecretsAsync(string path = null);
        Task<Dictionary<string, string>> UpdateSecretsAsync(Dictionary<string, string> secrets, string path = null);
        Task DeleteSecretsAsync(string path = null);
        void SetSecretsPath(string path);
    }
}
