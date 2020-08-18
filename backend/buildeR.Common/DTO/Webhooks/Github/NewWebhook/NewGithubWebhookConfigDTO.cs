using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.Common.DTO.Webhooks.Github.NewWebhook
{
    public class NewGithubWebhookConfigDTO
    {
        public string Url { get; set; }
        public string Content_Type { get; } = "json";
        public string Insecure_SSL { get; } = "0";
    }
}
