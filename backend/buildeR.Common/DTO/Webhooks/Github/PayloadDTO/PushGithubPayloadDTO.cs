using buildeR.Common.DTO.Webhooks.Github.Shared;

namespace buildeR.Common.DTO.Webhooks.Github.PayloadDTO
{
    public class PushGithubPayloadDTO
    {
        public string Ref { get; set; }
        public UserGithubDTO Sender { get; set; }
    }
}
