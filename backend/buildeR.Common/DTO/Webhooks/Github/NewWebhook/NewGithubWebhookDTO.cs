using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.Common.DTO.Webhooks.Github.NewWebhook
{
    public class NewGithubWebhookDTO
    {
        public string name { get; } = "web";
        public bool active { get; set; } = true;
        public IList<string> events { get; set; } = new List<string>();
        public NewGithubWebhookConfigDTO config { get; } = new NewGithubWebhookConfigDTO();
    }
}
