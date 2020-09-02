using buildeR.BLL.Interfaces;
using buildeR.BLL.RabbitMQ;
using buildeR.BLL.Services.Abstract;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class BuildOperationsService : IBuildOperationsService
    {
        private readonly IProjectService _projectService;
        private readonly ProcessorProducer _producer;
        public BuildOperationsService(IProjectService projectService, ProcessorProducer producer)
        {
            _projectService = projectService;
            _producer = producer;
        }
        public Task CancelBuild(int projectId)
        {
            throw new NotImplementedException();
        }

        public async Task StartBuild(int projectId, int buildHistoryId, string branchName, int userId)
        {
            var build = await _projectService.GetExecutiveBuild(projectId);
            build.BuildHistoryId = buildHistoryId;
            build.UserId = userId;
            build.BranchName = branchName;
            _producer.Send(JsonConvert.SerializeObject(build), build.GetType().Name);
        }
    }
}
