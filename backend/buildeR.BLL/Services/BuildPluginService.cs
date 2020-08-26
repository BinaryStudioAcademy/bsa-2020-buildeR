using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.BuildPlugin;
using Microsoft.Extensions.Caching.Memory;
using System;
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
        private readonly IMemoryCache _cache;

        public BuildPluginService(IHttpClient httpClient, IMemoryCache cache)
        {
            _httpClient = httpClient;
            _cache = cache;
        }

        public async Task<IEnumerable<string>> GetVersionsOfBuildPlugin(string buildPluginName, string partOfVersionWord)
        {
            IEnumerable<PluginVersionDTO> result = null;
            if (!_cache.TryGetValue(buildPluginName, out result))
            {
                var response = await _httpClient
                    .SendRequestAsync(HttpMethod.Get, $"{DockerHubRepositoriesUrl}/{buildPluginName}/tags", null);
                result = await _httpClient.GetResponseResultOrDefaultAsync<IEnumerable<PluginVersionDTO>>(response);
                if (result != null)
                {
                    _cache.Set(buildPluginName, result,
                        new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromMinutes(60)));
                }
            }

            return result
                .Where(version => version.Name.Equals(partOfVersionWord) || version.Name.Contains(partOfVersionWord))
                .Take(10)
                .Select(version => version.Name);
        }
    }
}
