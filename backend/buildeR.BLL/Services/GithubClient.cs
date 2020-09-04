using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.Synchronization;
using buildeR.Common.DTO.Synchronization.Github;
using buildeR.Common.DTO.Webhooks.Github.NewWebhook;
using buildeR.Common.Enums;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
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

        public async Task<GithubUser> GetUserFromToken(string token)
        {
            SetUpHttpClient(token);

            var endpoint = $"user";
            var response = await _client.GetAsync(endpoint);
            var content = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<GithubUser>(content);
        }
        public async Task<IEnumerable<GithubRepository>> GetUserRepositories(string token)
        {
            SetUpHttpClient(token);

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
        public async Task<IEnumerable<GithubBranch>> GetPrivateRepositoryBranches(string repositoryName, string token)
        {
            SetUpHttpClient(token);

            var user = await GetUserFromToken(token);

            var endpoint = $"repos/{user.Login}/{repositoryName}/branches";
            var response = await _client.GetAsync(endpoint);
            var content = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<IEnumerable<GithubBranch>>(content);
        }
        public async Task<IEnumerable<GithubBranch>> GetPublicRepositoryBranches(string repositoryName, string repositoryOwner)
        {
            var endpoint = $"repos/{repositoryOwner}/{repositoryName}/branches";
            var response = await _client.GetAsync(endpoint);
            var content = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<IEnumerable<GithubBranch>>(content);
        }
        public async Task<GithubCommit> GetLastBranchCommit(string repoName, string repoOwner, string branchName, string token = null)
        {
            if (token != null)
                SetUpHttpClient(token);

            var endpoint = $"repos/{repoOwner}/{repoName}/commits/{branchName}";
            var response = await _client.GetAsync(endpoint);
            var content = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<GithubCommit>(content);
        }
        public async Task<bool> CheckIfRepositoryAccessable(string repoName, string repoOwner, string token = null)
        {
            if (token != null)
                SetUpHttpClient(token);

            var endpoint = $"repos/{repoOwner}/{repoName}";
            var response = await _client.GetAsync(endpoint);

            return response.IsSuccessStatusCode;
        }
        public async Task<AccessTokenCheckDTO> CheckIfTokenValid(string token)
        {
            SetUpHttpClient(token);

            var checkDTO = new AccessTokenCheckDTO();

            var response = await _client.GetAsync("");

            checkDTO.IsSucceed = response.IsSuccessStatusCode;
            if (checkDTO.IsSucceed)
                checkDTO.Message = "All required scopes are seted up";
            else
                checkDTO.Message = "Access token does not exist";

            if(checkDTO.IsSucceed)
            {
                var scopes = response.Headers.GetValues("X-OAuth-Scopes").Single().Split(", ");
                var missingScopes = new List<string>();

                var userScopes = scopes.Contains("read:user") || scopes.Contains("write:user") || scopes.Contains("user");

                if (!userScopes)
                {
                    missingScopes.Add("read:user");
                }

                if(!scopes.Contains("repo"))
                {
                    missingScopes.Add("repo");
                }

                var webhookScopes = scopes.Contains("write:repo_hook") || scopes.Contains("admin:repo_hook");

                if (!webhookScopes)
                {
                    missingScopes.Add("write:repo_hook");
                }

                if(missingScopes.Count != 0)
                {
                    checkDTO.IsSucceed = false;
                    checkDTO.Message = "Those scopes are missed: \n";
                    checkDTO.Message += missingScopes.Aggregate((a, b) => a + ", " + b);
                }
            }

            return checkDTO;
        }
        public async Task CreateWebhook(string repositoryName, string eventName, string callback, string token)
        {
            var user = await GetUserFromToken(token);

            var endpoint = $"repos/{user.Login}/{repositoryName}/hooks";

            var hook = new NewGithubWebhookDTO();
            hook.events.Add(eventName);
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
