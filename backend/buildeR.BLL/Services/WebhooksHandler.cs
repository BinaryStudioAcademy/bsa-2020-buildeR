using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.Webhooks.Github.PayloadDTO;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class WebhooksHandler : IWebhooksHandler
    {
        private readonly IBuildOperationsService _builder;

        public WebhooksHandler(IBuildOperationsService builder)
        {
            _builder = builder;
        }
        public async Task HandleGithubPushEvent(int projectId, PushGithubPayloadDTO payload)
        {
            //When commit is pushed to branch github send payload object with property
            //"refs": "refs/heads/*name of branch*"
            if (!payload.Ref.StartsWith("refs/heads/"))
                return;

            //I parse this property in branch name in the next line:
            var updatedBranch = payload.Ref.Substring(11);

            await _builder.StartBuild(projectId);
        }
    }
}
