using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.Synchronization.Github;
using buildeR.Common.DTO.Webhooks.Github.NewWebhook;
using buildeR.Common.Enums;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
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
        public GithubClient(IHttpClientFactory factory)
        {
            _client = factory.CreateClient("github");
        }

        public async Task<GithubUser> GetUserFromCredentials(string username, string password)
        {
            SetUpHttpClient(username, password);

            var endpoint = $"user";
            var response = await _client.GetAsync(endpoint);
            var content = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<GithubUser>(content);
        }
        public async Task<IEnumerable<GithubRepository>> GetUserRepositories(string username, string password)
        {
            SetUpHttpClient(username, password);

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
        public async Task<IEnumerable<GithubBranch>> GetRepositoryBranches(string repositoryName, string username, string password)
        {
            SetUpHttpClient(username, password);

            var user = await GetUserFromCredentials(username, password);

            var endpoint = $"repos/{user.Login}/{repositoryName}/branches";
            var response = await _client.GetAsync(endpoint);
            var content = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<IEnumerable<GithubBranch>>(content);

        }
        public async Task<bool> CheckIfRepositoryAccessable(string repoOwner, string repoName, string username = null, string password = null)
        {
            if (username != null && password != null)
                SetUpHttpClient(username, password);

            var endpoint = $"repos/{repoOwner}/{repoName}";
            var response = await _client.GetAsync(endpoint);

            return response.IsSuccessStatusCode;
        }
        public async Task CreateWebhook(string repositoryName, string callback, string username, string password)
        {
            var user = await GetUserFromCredentials(username, password);

            var endpoint = $"repos/{user.Login}/{repositoryName}/hooks";

            var hook = new NewGithubWebhookDTO();
            hook.events.Add("push");
            hook.config.url = callback;

            var serializedHook = JsonConvert.SerializeObject(hook);
            var content = new StringContent(serializedHook, Encoding.UTF8, "application/json");

            var response = await _client.PostAsync(endpoint, content);
        }

        private void SetUpHttpClient(string username, string password)
        {
            var authenticationString = $"{username}:{password}";
            var base64EncodedAuthenticationString = Convert.ToBase64String(ASCIIEncoding.UTF8.GetBytes(authenticationString));
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic ", base64EncodedAuthenticationString);
        }
    }
}
