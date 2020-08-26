using buildeR.BLL.Interfaces;

using Newtonsoft.Json;

using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class BuilderHttpClient : IHttpClient
    {
        private readonly HttpClient _httpClient;

        public BuilderHttpClient(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        public async Task<T> GetResponseResultOrDefaultAsync<T>(HttpResponseMessage responseMessage)
        {
            var result = await GetResponseResultAsync(responseMessage);
            return responseMessage.IsSuccessStatusCode && !string.IsNullOrWhiteSpace(result) ? JsonConvert.DeserializeObject<T>(result) : default;
        }

        public Task<string> GetResponseResultAsync(HttpResponseMessage response)
        {
            return response.Content.ReadAsStringAsync();
        }

        public Task<HttpResponseMessage> SendRequestAsync(HttpMethod httpMethod, string url, object contentToSerialize)
        {
            var jsonObject = JsonConvert.SerializeObject(contentToSerialize);
            var content = new StringContent(jsonObject, Encoding.UTF8, "application/json");

            var message = new HttpRequestMessage(httpMethod, url)
            {
                Content = content
            };

            return _httpClient.SendAsync(message);
        }
    }
}
