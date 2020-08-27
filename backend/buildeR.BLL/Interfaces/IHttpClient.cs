using System.Net.Http;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IHttpClient
    {
        Task<T> GetResponseResultOrDefaultAsync<T>(HttpResponseMessage responseMessage);

        Task<string> GetResponseResultAsync(HttpResponseMessage response);

        Task<HttpResponseMessage> SendRequestAsync(HttpMethod httpMethod, string url, object contentToSerialize);
    }
}
