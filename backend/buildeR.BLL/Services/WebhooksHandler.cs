using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.Webhooks.Github.PayloadDTO;
using buildeR.Common.Enums;
using buildeR.DAL.Context;
using System.Linq;
using System.Threading.Tasks;
using buildeR.BLL.Services.Abstract;

namespace buildeR.BLL.Services
{
    public class WebhooksHandler : IWebhooksHandler
    {
        private readonly IBuildOperationsService _builder;
        private readonly IProjectService _projectService;
        public WebhooksHandler(IBuildOperationsService builder,
                               IProjectService projectService)
        {
            _builder = builder;
            _projectService = projectService;
        }
        public async Task HandleGithubPushEvent(int projectId, PushGithubPayloadDTO payload)
        {
            //When commit is pushed to branch github send payload object with property
            //"refs": "refs/heads/*name of branch*"
            if (!payload.Ref.StartsWith("refs/heads/"))
                return;

            //I parse this property in branch name in the next line:
            var updatedBranch = payload.Ref.Substring(11);

            var triggers = await _projectService.GetProjectRemoteTriggers(projectId);
            var pushTrigger = triggers.FirstOrDefault(t => (t.Type == RemoteTriggerType.Push ||
                                                            t.Type ==RemoteTriggerType.All) && 
                                                            t.Branch == updatedBranch);

            if (pushTrigger == null)
                return;

            var rebuild = await _builder.PrepareBuild(projectId, payload.Sender.Login, updatedBranch);

            await _builder.StartBuild(projectId, rebuild.Id, updatedBranch, rebuild.PerformerId);
        }

        public async Task HandleGithubPullRequestEvent(int projectId, PullRequestGithubPayloadDTO payload)
        {
            //Github fire pull_request event on every activity with pull requests
            //Next line filter only closed pull requests, which was merged
            if (payload.Action != "closed" || payload.Pull_Request?.Merged_At == null)
                return;

            var updatedBranch = payload.Pull_Request.Base.Ref;

            var triggers = await _projectService.GetProjectRemoteTriggers(projectId);
            var pullRequestTrigger = triggers.FirstOrDefault(t => (t.Type == RemoteTriggerType.PullRequest ||
                                                                   t.Type == RemoteTriggerType.All) &&
                                                                   t.Branch == updatedBranch);

            if (pullRequestTrigger == null)
                return;

            var rebuild = await _builder.PrepareBuild(projectId, payload.Sender.Login, updatedBranch);
            
            await _builder.StartBuild(projectId, rebuild.Id, updatedBranch, (await _projectService.GetAsync(projectId)).OwnerId);
        }
    }
}
