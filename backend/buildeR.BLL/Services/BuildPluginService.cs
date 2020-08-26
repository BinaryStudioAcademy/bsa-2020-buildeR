using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.BuildPlugin;

using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class BuildPluginService : IBuildPluginService
    {
        private const string DockerHubRepositoriesUrl = "https://registry.hub.docker.com/v1/repositories";

        private readonly IHttpClient _httpClient;

        public BuildPluginService(IHttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<IEnumerable<string>> GetVersionsOfBuildPlugin(string buildPluginName, string partOfVersionWord)
        {
            var response = await _httpClient
                .SendRequestAsync(HttpMethod.Get, $"{DockerHubRepositoriesUrl}/{buildPluginName}/tags", null);
            var result = await _httpClient.GetResponseResultOrDefaultAsync<IEnumerable<PluginVersionDTO>>(response);

            return result
                .Where(version => version.Name.Equals(partOfVersionWord) || version.Name.Contains(partOfVersionWord))
                .Take(10)
                .Select(version => version.Name);
        }
    }
}
