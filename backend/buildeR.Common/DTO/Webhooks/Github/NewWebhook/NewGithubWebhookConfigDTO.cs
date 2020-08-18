using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.Common.DTO.Webhooks.Github.NewWebhook
{
    public class NewGithubWebhookConfigDTO
    {
        public string url { get; set; }
        public string content_type { get; } = "json";
        public string insecure_ssl { get; } = "1";
    }
}
