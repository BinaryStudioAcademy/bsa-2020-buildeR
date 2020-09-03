using buildeR.Common.DTO.Webhooks.Github.Shared;

namespace buildeR.Common.DTO.Webhooks.Github.PayloadDTO
{
    public class PullRequestGithubPayloadDTO
    {
        public string Action { get; set; }
        public PullRequestGithubDTO Pull_Request { get; set; }
        public UserGithubDTO Sender { get; set; }
    }
}
