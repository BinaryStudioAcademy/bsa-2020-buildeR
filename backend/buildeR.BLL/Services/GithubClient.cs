using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.Synchronization.Github;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class GithubClient : IGithubClient
    {
        private readonly HttpClient _client;
        public GithubClient(IHttpClientFactory factory)
        {
            _client = factory.CreateClient("github");
        }

        public Task<GithubUser> GetUserFromToken(int userId)
        {
            SetUpHttpClient(userId);

            throw new NotImplementedException();
            //todo
        }

        public Task<IEnumerable<GithubBranch>> GetRepositoryBranches(int userId, string repositoryName)
        {
            SetUpHttpClient(userId);

            throw new NotImplementedException();
            //todo
        }

        public async Task<IEnumerable<GithubRepository>> GetUserRepositories(int userId)
        {
            SetUpHttpClient(userId);

            var endpoint = $"user/repos?visibility=all&affiliation=owner";
            var response = await _client.GetAsync(endpoint);
            var content = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<IEnumerable<GithubRepository>>(content);
        }

        private void SetUpHttpClient(int userId)
        {
            //todo: get github access token from database
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("token", "69b84d50ca36b473c82893e30a35ee065944c748");
        }
    }
}
