using buildeR.Common.DTO;
using buildeR.Common.DTO.BuildHistory;
using buildeR.Common.DTO.BuildStep;
using buildeR.Kafka;
using buildeR.RabbitMq.Interfaces;
using LibGit2Sharp;
using Microsoft.Extensions.Configuration;
using Nest;
using Newtonsoft.Json;
using Scriban;
using Serilog;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using buildeR.Common.Enums;
using Microsoft.Extensions.Hosting;
using System.Threading;

namespace buildeR.Processor.Services
{
    public class ProcessorService : IHostedService
    {
        private readonly IConsumer _consumer;
        private readonly IProducer _buildStatusesProducer;
        private readonly KafkaProducer _kafkaProducer;
        private readonly string _pathToProjects;
        private readonly IElasticClient _elk;

        private bool IsCurrentOsLinux => RuntimeInformation.IsOSPlatform(OSPlatform.Linux);

        private void SendBuildStatus(BuildStatus status, int buildHistoryId)
        {
            var statusChange = new StatusChangeDto
            {
                Time = DateTime.Now,
                Status =status,
                BuildHistoryId = buildHistoryId
            };
            _buildStatusesProducer.Send(JsonConvert.SerializeObject(statusChange));
        }

        public ProcessorService(IConfiguration config, IConsumer consumer, IProducer buildStatusesProducer, IElasticClient elk)
        {
            _pathToProjects = Path.Combine(Path.GetTempPath(), "buildeR", "Projects");

            _kafkaProducer = new KafkaProducer(config, "weblog");

            _elk = elk;

            _consumer = consumer;
            _consumer.Received += Consumer_Received;

            _buildStatusesProducer = buildStatusesProducer;
        }

        private async void Consumer_Received(object sender, RabbitMQ.Client.Events.BasicDeliverEventArgs e)
        {
            var key = e.RoutingKey;
            var message = Encoding.UTF8.GetString(e.Body.ToArray());
            var executeBuild = JsonConvert.DeserializeObject<ExecutiveBuildDTO>(message);
            SendBuildStatus(BuildStatus.InProgress, executeBuild.BuildHistoryId);
            // mock success
            await BuildProjectAsync(executeBuild).ContinueWith(t =>
            {
                SendBuildStatus(BuildStatus.Success, executeBuild.BuildHistoryId);
            });
            _consumer.SetAcknowledge(e.DeliveryTag, true);
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _consumer.Consume();
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            Log.Information("Processor stopped");
            return Task.CompletedTask;
        }

        #region Build and output

        public async Task BuildProjectAsync(ExecutiveBuildDTO build)
        {
            var pathToClonedRepository = Path.Combine(
                _pathToProjects,
                $"{build.ProjectId}{DateTime.Now.Millisecond}{new Random().Next(1000000)}",
                "ClonedRepository"
                );

            CloneRepository(build.RepositoryUrl, pathToClonedRepository);

            try
            {
                var dockerFileContent = GenerateDockerFileContent(build.BuildSteps, build.RepositoryUrl);
                await CreateDockerFileAsync(dockerFileContent, pathToClonedRepository);

                BuildDockerImage(pathToClonedRepository, build.ProjectId);
            }
            catch (Exception e)
            {
                Log.Error($"Error while building docker image. Reason: {e.Message}");
            }
            finally
            {
                DeleteClonedRepository(pathToClonedRepository);

                // Remove all unused containers, networks, images (both dangling and unreferenced)
                Process process = new Process();
                process.StartInfo.FileName = "docker";
                process.StartInfo.Arguments = "system prune -f";
                process.Start();
                process.WaitForExit();
            }
        }

        public void BuildDockerImage(string path, int projectId)
        {
            Process process = new Process();
            process.StartInfo.FileName = "docker";
            process.StartInfo.Arguments = $"build {path}";
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.RedirectStandardOutput = true;
            process.StartInfo.RedirectStandardError = true;
            //* Set your output and error (asynchronous) handlers
            process.OutputDataReceived += (object _sender, DataReceivedEventArgs _args) =>
                OutputHandler(_sender, _args, projectId);
            process.ErrorDataReceived += (object _sender, DataReceivedEventArgs _args) =>
                OutputHandler(_sender, _args, projectId);
            //* Start process and handlers
            process.Start();
            process.BeginOutputReadLine();
            process.BeginErrorReadLine();
            process.WaitForExit();
        }

        private bool areDockerLogs = true;
        private int startLogging = 2;

        public async void OutputHandler(object sendingProcess, DataReceivedEventArgs outLine, int projectId)
        {
            // If log starts with Step and containts FROM we stop logging because there will be useless Docker logs 
            // (also applied to "Removing intermediate container" and "Sending build context"). Skip checking empty strings
            if (outLine.Data != null &&
              ((outLine.Data.StartsWith("Step") && outLine.Data.Contains("FROM")) ||
                outLine.Data.StartsWith("Removing intermediate container") ||
                outLine.Data.StartsWith("Sending build context")))
            {
                areDockerLogs = true;
                startLogging = 2;
            }
            // We begin logging again after logs that starts with Step and contains RUN. Usually RUN starts process, which we need logs to take from
            // TODO: We can add checking 'contains' from list, that will have all starter commands like RUN, CMD, etc.
            else if (outLine.Data != null &&
                    (outLine.Data.StartsWith("Step") &&
                     outLine.Data.Contains("RUN")))
            {
                areDockerLogs = false;

                // Add one specific string to divide different build steps
                var log = new ProjectLog()
                {
                    Timestamp = DateTime.Now,
                    Message = $">>> Here starts a new step",
                    BuildId = projectId,
                    BuildStep = 1
                };
                await _kafkaProducer.SendLog(log);
            }

            // This function is needed to get rid of first two lines before actual logs of our process
            if (!areDockerLogs)
                startLogging--;

            if (!areDockerLogs && startLogging < 0)
            {
                var log = new ProjectLog()
                {
                    Timestamp = DateTime.Now,
                    Message = outLine.Data,
                    BuildId = projectId,
                    BuildStep = 1
                };
                await _elk.IndexDocumentAsync(log);
                await _kafkaProducer.SendLog(log);
            }
        }

        #endregion

        #region Directory and repository

        private void CloneRepository(string repositoryUrl, string path)
        {
            try
            {
                Directory.CreateDirectory(path);
                Repository.Clone(repositoryUrl, path);//TODO: add an ability to clone by commit and to clone from private repos (Vault?)
            }
            catch (Exception e)
            {
                Log.Error($"Cannot clone repo. Reason: {e.Message}");
            }
        }

        private void DeleteClonedRepository(string pathToClonedRepository)
        {
            var pathToParentDirectory = pathToClonedRepository.Remove(pathToClonedRepository.LastIndexOf(IsCurrentOsLinux ? "/" : "\\", StringComparison.Ordinal));
            DeleteFolderWithSubfolders(pathToParentDirectory);
        }

        private void DeleteFolderWithSubfolders(string path)
        {
            foreach (var sub in Directory.EnumerateDirectories(path))
            {
                DeleteFolderWithSubfolders(sub);
            }
            foreach (var file in Directory.EnumerateFiles(path))
            {
                var fileInfo = new FileInfo(file) { Attributes = FileAttributes.Normal };
                fileInfo.Delete();
            }
            Directory.Delete(path);
        }
        #endregion

        #region Dockerfile
        private string GenerateDockerFileContent(IEnumerable<BuildStepDTO> buildSteps, string repositoryUrl)
        {
            string dockerfile = "";

            /* Base template for generating dockerfile
            FROM {{ docker_image }}:latest AS {{ step_name }}
            WORKDIR /src
            COPY . .
            WORKDIR /src/{{ work_directory }}
            ENV {{ key }}={{ value }} // if any
            RUN {{ runner }} {{ command }} {{ arg.key }} {{ arg.value }} // if any args
            */
            var template = Template.Parse(
                 "FROM {{ this.plugin_command.plugin.docker_image_name }}:latest AS {{ this.work_directory }}\r\n" +
                 "WORKDIR \"/src\"\r\n" +
                 "COPY . .\r\n" +
                 "WORKDIR \"/src/{{ this.work_directory }}\"\r\n" +
                 "{{ if this.env_variable }}ENV {{ this.env_variable.key }}={{ this.env_variable.value }} {{ end }}\r\n" +
                 "RUN {{ this.plugin_command.plugin.command }} {{ this.plugin_command.name }} {{ for arg in this.command_arguments }} {{ arg.key }} {{ arg.value }} {{ end }}\r\n\r\n");

            foreach (var step in buildSteps)
                dockerfile += template.Render(step);

            return dockerfile;
        }

        private async Task CreateDockerFileAsync(string content, string path)
        {
            var dockerFilePath = Path.Combine(path, "Dockerfile");

            using var fileStream = File.CreateText(dockerFilePath);
            await fileStream.WriteAsync(content);
        }
        #endregion
    }
}
