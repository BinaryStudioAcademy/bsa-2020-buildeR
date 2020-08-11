using buildeR.Common.DTO.BuildHistory;
using buildeR.Common.DTO.BuildPluginParameter;
using buildeR.Common.DTO.BuildStep;
using buildeR.RabbitMq.Interfaces;

using LibGit2Sharp;

using Newtonsoft.Json;

using Serilog;

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.Processor.Services
{
    public class ProcessorService : IProcessorService, IDisposable
    {
        #region Properties\fields
        private readonly IConsumer _consumer;
        private readonly string _pathToProjects;
        private string _pathToFile;

        private string FileExtension => IsCurrentOsLinux ? "sh" : "cmd";
        private bool IsCurrentOsLinux => RuntimeInformation.IsOSPlatform(OSPlatform.Linux);
        private string PathToWorkDirectory => Path.Combine(_pathToFile, "ClonedRepository");
        #endregion

        public ProcessorService(IConsumer consumer)
        {
            _pathToProjects = Path.Combine(Path.GetTempPath(), "buildeR", "Projects");

            _consumer = consumer;
            _consumer.Received += Consumer_Received;
        }

        private void Consumer_Received(object sender, RabbitMQ.Client.Events.BasicDeliverEventArgs e)
        {
            var key = e.RoutingKey;
            var message = Encoding.UTF8.GetString(e.Body.ToArray());
            var executeBuild = JsonConvert.DeserializeObject<ExecutiveBuildDTO>(message);
            BuildProjectAsync(executeBuild);
            _consumer.SetAcknowledge(e.DeliveryTag, true);
        }

        public void Register()
        {
            _consumer.Consume();
        }

        public void Deregister()
        {
            Log.Information(" >>>> Deregister");
        }


        public async Task BuildProjectAsync(ExecutiveBuildDTO build)
        {
            _pathToFile = Path.Combine(_pathToProjects, build.ProjectId.ToString());

            EnsureExistDirectory(_pathToFile);

            var fileNames = new string[build.BuildSteps.Count()];

            for (var i = 0; i < build.BuildSteps.Count(); i++)
            {
                fileNames[i] = GenerateBuildStepFileName(build.BuildSteps.ElementAt(i));

                await using (var buildStepFile = new StreamWriter(Path.Combine(_pathToFile, fileNames[i])))
                {
                    await buildStepFile.WriteLineAsync(GenerateStepBuildFileContent(build.BuildSteps.ElementAt(i)));
                }
            }

            CloneRepository(build.RepositoryUrl);

            await LaunchBuildAsync(build.BuildSteps, fileNames);

            DeleteClonedRepository(PathToWorkDirectory);
        }

        private async Task LaunchBuildAsync(IEnumerable<ExecutiveBuildStepDTO> steps, IReadOnlyList<string> fileNames)
        {
            using (var process = new Process())
            {
                process.StartInfo.UseShellExecute = false;
                process.StartInfo.RedirectStandardOutput = true;
                process.StartInfo.RedirectStandardError = true;
                process.StartInfo.CreateNoWindow = false;

                for (var i = 0; i < steps.Count(); i++)
                {
                    try
                    {
                        process.StartInfo.FileName = Path.Combine(_pathToFile, fileNames[i]);
                        process.StartInfo.CreateNoWindow = true;
                        process.Start();

                        var stepOutput = await process.StandardOutput.ReadToEndAsync();
                        var errorOutput = await process.StandardError.ReadToEndAsync();

                        var info = new StringBuilder()
                            .AppendLine()
                            .Append("Result of run #").Append(steps.ElementAt(i).Index).AppendLine(" command")
                            .Append("Duration: ").Append((process.ExitTime - process.StartTime).TotalSeconds.ToString("F")).AppendLine(" seconds")
                            .AppendLine("Output:")
                            .AppendLine(stepOutput)
                            .ToString();

                        Log.Information(info);

                        if (!string.IsNullOrWhiteSpace(errorOutput))
                        {
                            Log.Error(errorOutput);
                        }
                    }
                    catch (Exception e)
                    {
                        Log.Error(e.Message);
                    }
                }
            }
        }

        #region Work with files
        private string GenerateBuildStepFileName(ExecutiveBuildStepDTO buildStep)
        {
            return $"{buildStep.Index}.{FileExtension}";
        }

        private string GenerateStepBuildFileContent(ExecutiveBuildStepDTO step)
        {
            return IsCurrentOsLinux ? GenerateContentForLinux(step) : GenerateContentForWindows(step);
        }

        private string GenerateContentForWindows(ExecutiveBuildStepDTO step)
        {
            var stringBuilder = new StringBuilder();

            //TODO Is need to set env variables and which?
            stringBuilder
                .AppendLine("@echo off")
                .AppendLine("SETLOCAL ENABLEEXTENSIONS")
                .AppendLine("SET me=%~n0")
                .Append("cd ").AppendLine(Path.Combine(_pathToFile, "ClonedRepository"))
                .Append(step.BuildPluginCommand).Append(" ")
                .Append(step.PluginCommand).Append(" ");

            foreach (var buildPluginParameter in step.Parameters ?? Enumerable.Empty<BuildPluginParameterDTO>())
            {
                stringBuilder
                    .Append(buildPluginParameter.Key).Append(" ")
                    .Append(buildPluginParameter.Value).Append(" ");
            }

            Log.Information($"~~~ Generated text:\n{stringBuilder}");
            return stringBuilder.ToString();
        }

        private string GenerateContentForLinux(ExecutiveBuildStepDTO step)
        {
            var stringBuilder = new StringBuilder();
            //TODO Is need to set env variables and which?
            stringBuilder
                .AppendLine("#!/bin/bash")
                .Append("cd ").AppendLine(Path.Combine(_pathToFile, "ClonedRepository"))
                .Append(step.BuildPluginCommand).Append(" ")
                .Append(step.PluginCommand).Append(" ");

            foreach (var buildPluginParameter in step.Parameters ?? Enumerable.Empty<BuildPluginParameterDTO>())
            {
                stringBuilder
                    .Append(buildPluginParameter.Key).Append(" ")
                    .Append(buildPluginParameter.Value).Append(" ");
            }

            Log.Information($"~~~ Generated text:\n{stringBuilder}");
            return stringBuilder.ToString();
        }
        #endregion

        #region Directory
        private void CloneRepository(string repositoryUrl)
        {
            try
            {
                EnsureExistDirectory(PathToWorkDirectory);
                Repository.Clone(repositoryUrl, PathToWorkDirectory);
            }
            catch (Exception e)
            {
                Log.Error(e.Message);
            }
        }

        private void EnsureExistDirectory(string path)
        {
            Directory.CreateDirectory(path);
        }

        private void DeleteClonedRepository(string path)
        {
            foreach (var sub in Directory.EnumerateDirectories(path))
            {
                DeleteClonedRepository(sub);
            }
            foreach (var file in Directory.EnumerateFiles(path))
            {
                var fileInfo = new FileInfo(file) { Attributes = FileAttributes.Normal };
                fileInfo.Delete();
            }
            Directory.Delete(path);
        }
        #endregion

        public void Dispose()
        {
        }
    }
}
