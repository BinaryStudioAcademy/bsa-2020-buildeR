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
        private readonly BuilderContext _context;
        private readonly ProcessorProducer _producer;
        public BuildOperationsService(IProjectService projectService,
                                      BuilderContext context,
                                      ProcessorProducer producer)
        {
            _projectService = projectService;
            _context = context;
            _producer = producer;
        }
        public Task CancelBuild(int projectId)
        {
            throw new NotImplementedException();
        }
        public async Task<BuildHistory> PrepareBuild(int projectId, string buildAuthorUsername)
        {
            var user = await GetUserByUsername(buildAuthorUsername);

            var build = new BuildHistory();

            build.ProjectId = projectId;
            build.PerformerId = user?.Id;
            build.BuildStatus = BuildStatus.Pending;
            build.StartedAt = DateTime.Now;
            build.Number = _context.BuildHistories.Count(b => b.ProjectId == projectId) + 1;

            _context.Add(build);
            await _context.SaveChangesAsync();

            return build;
        }
        public async Task StartBuild(int projectId, int buildHistoryId, string branchName)
        {
            var build = await _projectService.GetExecutiveBuild(projectId);
            build.BuildHistoryId = buildHistoryId;
            build.BranchName = branchName;
            _producer.Send(JsonConvert.SerializeObject(build), build.GetType().Name);
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
