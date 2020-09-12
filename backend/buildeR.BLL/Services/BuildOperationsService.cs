using buildeR.BLL.Exceptions;
using buildeR.BLL.Interfaces;
using buildeR.BLL.RabbitMQ;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.Enums;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class BuildOperationsService : IBuildOperationsService
    {
        private readonly IProjectService _projectService;
        private readonly ISynchronizationService _synchronizationService;
        private readonly BuilderContext _context;
        private readonly ProcessorProducer _producer;
        public BuildOperationsService(IProjectService projectService,
                                      ISynchronizationService synchronizationService,
                                      BuilderContext context,
                                      ProcessorProducer producer)
        {
            _projectService = projectService;
            _synchronizationService = synchronizationService;
            _context = context;
            _producer = producer;
        }
        public Task CancelBuild(int projectId)
        {
            throw new NotImplementedException();
        }

        public async Task<BuildHistory> PrepareBuild(int projectId, string buildAuthorUsername, string triggeredBranch)
        {
            var user = await GetUserByUsername(buildAuthorUsername);

            var build = new BuildHistory
            {
                ProjectId = projectId,
                PerformerId = user?.Id,
                BuildStatus = BuildStatus.Pending,
                StartedAt = DateTime.Now,
                BranchHash = triggeredBranch,
                Number = _context.BuildHistories.Count(b => b.ProjectId == projectId) + 1
            };

            var lastCommit = await _synchronizationService.GetLastProjectCommit(projectId, triggeredBranch);
            build.CommitHash = lastCommit.Hash;

            _context.Add(build);
            await _context.SaveChangesAsync();

            return build;
        }
        public async Task StartBuild(int projectId, int buildHistoryId, string branchName, int? userId)
        {
            var build = await _projectService.GetExecutiveBuild(projectId);
            build.BuildHistoryId = buildHistoryId;
            build.UserId = userId;
            build.BranchName = branchName;
            _producer.Send(JsonConvert.SerializeObject(build, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            }), build.GetType().Name);
        }

        private async Task<User> GetUserByUsername(string username)
        {
            var user = await _context.Users.Include(u => u.UserSocialNetworks)
                                     .FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                return null;
            }

            if (!user.UserSocialNetworks.Any(sn => sn.ProviderName == Provider.GitHub))
            {
                return null;
            }

            return user;
        }
    }
}
