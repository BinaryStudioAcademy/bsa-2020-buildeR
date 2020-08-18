using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.Common.DTO.Webhooks.Github.NewWebhook
{
    public class NewGithubWebhookDTO
    {
        public string Name { get; } = "web";
        public bool Active { get; set; } = true;
        public IList<string> Events { get; set; } = new List<string>();
        public NewGithubWebhookConfigDTO Config { get; } = new NewGithubWebhookConfigDTO();
    }
}
