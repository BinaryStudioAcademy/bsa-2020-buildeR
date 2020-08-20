using buildeR.Common.DTO.Webhooks.Github.PayloadDTO;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IWebhooksHandler
    {
        Task HandleGithubPushEvent(int projectId, PushGithubPayloadDTO payload);
    }
}
