using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.Synchronization.Github;
using buildeR.Common.DTO.Webhooks.Github.NewWebhook;
using buildeR.Common.Enums;
using buildeR.DAL.Context;
using Microsoft.EntityFrameworkCore;
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
        private readonly BuilderContext _context;
        public GithubClient(IHttpClientFactory factory, BuilderContext context)
        {
            _client = factory.CreateClient("github");
            _context = context;
        }

        public async Task<GithubUser> GetUserFromToken(string providerToken)
        {
            SetUpHttpClient(providerToken);

            var endpoint = $"user";
            var response = await _client.GetAsync(endpoint);
            var content = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<GithubUser>(content);
        }
        public async Task<IEnumerable<GithubBranch>> GetRepositoryBranches(string repositoryName, string providerToken)
        {
            SetUpHttpClient(providerToken);

            var user = await GetUserFromToken(providerToken);

            var endpoint = $"repos/{user.Login}/{repositoryName}/branches";
            var response = await _client.GetAsync(endpoint);
            var content = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<IEnumerable<GithubBranch>>(content);
        }

        public async Task<IEnumerable<GithubBranch>> GetRepositoryBranches(string repositoryOwner, string repositoryName, string providerToken)
        {
            SetUpHttpClient(providerToken);

            var endpoint = $"repos/{repositoryOwner}/{repositoryName}/branches";
            var response = await _client.GetAsync(endpoint);
            var content = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<IEnumerable<GithubBranch>>(content);
        }
        public async Task<IEnumerable<GithubRepository>> GetUserRepositories(string providerToken)
        {
            SetUpHttpClient(providerToken);

            var allRepos = new List<GithubRepository>();
            var lastLoadedRepos = new List<GithubRepository>();

            const int reposPerRequest = 100;
            var pageNumber = 1;

            var endpoint = $"user/repos?visibility=all&affiliation=owner&per_page={reposPerRequest}&page=";
            
            do
            {
                lastLoadedRepos = new List<GithubRepository>();

                var response = await _client.GetAsync(endpoint + pageNumber);
                var content = await response.Content.ReadAsStringAsync();

                lastLoadedRepos.AddRange(JsonConvert.DeserializeObject<IEnumerable<GithubRepository>>(content));
                allRepos.AddRange(lastLoadedRepos);

                pageNumber++;
            }
            while (lastLoadedRepos.Count >= reposPerRequest);

            return allRepos;
        }
        public async Task CreateWebhook(string repositoryName, string callback, string providerToken)
        {
            var user = await GetUserFromToken(providerToken);

            var endpoint = $"repos/{user.Login}/{repositoryName}/hooks";

            var hook = new NewGithubWebhookDTO();
            hook.events.Add("push");
            hook.config.url = callback;

            var serializedHook = JsonConvert.SerializeObject(hook);
            var content = new StringContent(serializedHook, Encoding.UTF8, "application/json");

            var response = await _client.PostAsync(endpoint, content);
        }
        private void SetUpHttpClient(string token)
        {
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("token", token);
        }
    }
}
