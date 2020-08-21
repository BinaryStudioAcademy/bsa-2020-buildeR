using buildeR.Common.DTO;
using buildeR.Common.DTO.BuildHistory;
using buildeR.Common.DTO.BuildStep;
using buildeR.Kafka;
using buildeR.RabbitMq.Interfaces;
using LibGit2Sharp;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Scriban;
using Serilog;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace buildeR.Processor.Services
{
    public class ProcessorService
    {
        private readonly IConsumer _consumer;
        private readonly KafkaProducer _kafkaProducer;
        private readonly string _pathToProjects;

        public ProcessorService(IConfiguration config, IConsumer consumer)
        {
            _pathToProjects = Path.Combine(Path.GetTempPath(), "buildeR", "Projects");

            _kafkaProducer = new KafkaProducer(config, "weblog");

            _consumer = consumer;
            _consumer.Received += Consumer_Received;
        }

        private async void Consumer_Received(object sender, RabbitMQ.Client.Events.BasicDeliverEventArgs e)
        {
            var key = e.RoutingKey;
            var message = Encoding.UTF8.GetString(e.Body.ToArray());
            var executeBuild = JsonConvert.DeserializeObject<ExecutiveBuildDTO>(message);
            await BuildProjectAsync(executeBuild);
            _consumer.SetAcknowledge(e.DeliveryTag, true);
        }

        public void Register()
        {
            _consumer.Consume();
        }

        public void Unregister()
        {
            Log.Information(" >>>> Unregistered");
        }

        #region Build and output

        public async Task BuildProjectAsync(ExecutiveBuildDTO build)
        {
            var pathToClonedRepository = Path.Combine(
                _pathToProjects,
                $"{build.ProjectId}{DateTime.Now.Millisecond}{new Random().Next(1000000)}",
                "ClonedRepository"
                );

            try
            {
                CloneRepository(build.RepositoryUrl, pathToClonedRepository);

                var dockerFileContent = GenerateDockerFileContent(build.BuildSteps, build.RepositoryUrl);
                await CreateDockerFileAsync(dockerFileContent, pathToClonedRepository);

                buildDockerImage(pathToClonedRepository, build.ProjectId);
            }
            catch (Exception e)
            {
                Log.Error(e.Message);
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

        public void buildDockerImage(string path, int projectId)
        {
            Process process = new Process();
            process.StartInfo.FileName = "docker";
            process.StartInfo.Arguments = $"build {path}";
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.RedirectStandardOutput = true;
            process.StartInfo.RedirectStandardError = true;
            //* Set your output and error (asynchronous) handlers
            process.OutputDataReceived += (Object _sender, DataReceivedEventArgs _args) =>
                OutputHandler(_sender, _args, projectId);
            process.ErrorDataReceived += (Object _sender, DataReceivedEventArgs _args) =>
                OutputHandler(_sender, _args, projectId);
            //* Start process and handlers
            process.Start();
            process.BeginOutputReadLine();
            process.BeginErrorReadLine();
            process.WaitForExit();
        }

        public async void OutputHandler(object sendingProcess, DataReceivedEventArgs outLine, int projectId)
        {
            var log = new ProjectLog()
            {
                Timestamp = DateTime.Now,
                Message = outLine.Data,
                BuildId = projectId,
                BuildStep = 1
            };
            await _kafkaProducer.SendLog(log);
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
                Log.Error(e.Message);
            }
        }

        private void DeleteClonedRepository(string pathToClonedRepository)
        {
            var pathToParentDirectory = pathToClonedRepository.Remove(pathToClonedRepository.LastIndexOf(IsCurrentOsLinux ? "/" : "\\", StringComparison.Ordinal));
            DeleteFolderWithSubfolders(pathToParentDirectory);
        }
        private bool IsCurrentOsLinux => RuntimeInformation.IsOSPlatform(OSPlatform.Linux);
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
        private string GenerateDockerFileContent(IEnumerable<ExecutiveBuildStepDTO> buildSteps, string repositoryUrl)
        {
            string dockerfile = "";

            // Base template for generating dockerfile
            var template = Template.Parse(
                 "FROM {{ this.build_plugin.docker_image }}:latest AS {{ this.name }}\r\n" +
                 "WORKDIR \"/src\"\r\n" +
                 "COPY . .\r\n" +
                 "WORKDIR \"/src/{{ this.work_directory }}\"\r\n" +
                 "RUN {{ this.build_plugin.runner }} {{ this.plugin_command.name }}\r\n\r\n");

            foreach (var step in buildSteps)
                dockerfile += template.Render(step);

            return dockerfile;
        }

        private async Task CreateDockerFileAsync(string content, string path)
        {
            await using (var outputFile = new StreamWriter(Path.Combine(path, "Dockerfile")))
            {
                await outputFile.WriteAsync(content);
            }
        }
        #endregion
    }
}
