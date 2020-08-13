using buildeR.Common.DTO.BuildHistory;
using buildeR.Common.DTO.BuildStep;
using buildeR.RabbitMq.Interfaces;

using Docker.DotNet;
using Docker.DotNet.Models;

using ICSharpCode.SharpZipLib.Tar;

using LibGit2Sharp;

using Newtonsoft.Json;

using Serilog;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Globalization;

namespace buildeR.Processor.Services
{
    public class ProcessorService : IProcessorService, IDisposable
    {
        #region Properties\fields
        private readonly IConsumer _consumer;
        private readonly DockerClient _dockerClient;
        private readonly string _pathToProjects;

        private string DockerApiUri => IsCurrentOsLinux ? "unix:/var/run/docker.sock" : "npipe://./pipe/docker_engine";
        private bool IsCurrentOsLinux => RuntimeInformation.IsOSPlatform(OSPlatform.Linux);
        #endregion

        public ProcessorService(IConsumer consumer)
        {
            _pathToProjects = Path.Combine(Path.GetTempPath(), "buildeR", "Projects");

            _dockerClient = new DockerClientConfiguration(new Uri(DockerApiUri)).CreateClient();

            _consumer = consumer;
            _consumer.Received += Consumer_Received;
        }

        private void Consumer_Received(object sender, RabbitMQ.Client.Events.BasicDeliverEventArgs e)
        {
            var key = e.RoutingKey;
            /* TODO: remove
             * Example of sent message via RabbitMq:
             {"ProjectId":111,"RepositoryUrl":"https://bitbucket.org/rusgumeniuk/doc-an","BuildSteps":[{"BuildStepId":0,"Name":null,"Index":1,"PluginCommand":{"Id":0,"PluginId":0,"Name":"build","TemplateForDocker":"FROM {BUILD_PLUGIN_IMAGE}{BUILD_PLUGIN_VERSION} AS build\r\nWORKDIR /src\r\nCOPY [\"{WORK_DIR_NAME}/{WORK_DIR_NAME}.csproj\", \"{WORK_DIR_NAME}/\"]\r\nRUN {BUILD_PLUGIN_COMMAND} restore \"{WORK_DIR_NAME}/{WORK_DIR_NAME}.csproj\"\r\n\r\nCOPY . .\r\nWORKDIR \"/src/{WORK_DIR_NAME}\"\r\nCMD {BUILD_PLUGIN_COMMAND} {PLUGIN_COMMAND_NAME}","Plugin":null},"BuildPlugin":{"Id":0,"PluginName":".NET Core","Command":"dotnet","DockerImageName":"mcr.microsoft.com/dotnet/core/sdk","PluginCommands":null},"WorkDirectory":"Doc-AN","LoggingVerbosity":0,"Parameters":null}]}
             */
            var message = Encoding.UTF8.GetString(e.Body.ToArray());
            var executeBuild = JsonConvert.DeserializeObject<ExecutiveBuildDTO>(message);
            BuildProjectAsync(executeBuild);
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

        public async Task BuildProjectAsync(ExecutiveBuildDTO build)
        {
            var pathToClonedRepository = Path.Combine(_pathToProjects, build.ProjectId.ToString(), "ClonedRepository");

            try
            {
                //await RunTestHelloWorldContainerAsync();

                foreach (var buildStep in build.BuildSteps.OrderBy(step => step.Index))
                {
                    CloneRepository(build.RepositoryUrl, pathToClonedRepository);

                    var dockerFileContent = GenerateDockerFileContent(buildStep, build.RepositoryUrl);
                    await CreateDockerFileAsync(dockerFileContent, pathToClonedRepository);

                    var imageName = await CreateImageFromRepositoryWithDockerfileAsync(pathToClonedRepository);

                    const int port = 8111;//TODO: need to detect free port and use it
                    var containerId = await CreateContainerAsync(imageName, port);

                    if (string.IsNullOrWhiteSpace(imageName) || string.IsNullOrWhiteSpace(containerId))
                    {
                        DeleteFolderWithSubfolders(pathToClonedRepository.Remove(pathToClonedRepository.LastIndexOf(IsCurrentOsLinux ? "/" : "\\", StringComparison.Ordinal)));
                        throw new InvalidOperationException($"Image name {imageName}, container ID {containerId}");
                    }

                    Log.Information($" ================= Image with name '{imageName}' and container with ID [{containerId}] were created");

                    await RunContainerAsync(containerId);

                    await _dockerClient.Containers.WaitContainerAsync(containerId);
                    

                    var logs = await GetLogFromContainer(containerId);//TODO: sent via SignalR
                    Log.Information($" ================= Logs from container:\n{logs}");

                    await RemoveImageAndContainerAsync(imageName, containerId);

                    DeleteFolderWithSubfolders(pathToClonedRepository.Remove(pathToClonedRepository.LastIndexOf(IsCurrentOsLinux ? "/" : "\\", StringComparison.Ordinal)));
                }
            }
            catch (Exception e)
            {
                Log.Error(e.Message);
            }
        }



        #region Docker
        private async Task RunTestHelloWorldContainerAsync(ushort port = 7999)
        {
            const string imageName = "hello-world";
            await PullImageByNameAsync(imageName);
            var containerId = await CreateContainerAsync(imageName, port);
            var logs = await GetLogFromContainer(containerId);
            Log.Information(logs);
        }

        #region Dockerfile
        private string GenerateDockerFileContent(ExecutiveBuildStepDTO buildStep, string repositoryUrl)
        {
            var repositoryName = new string(repositoryUrl.TakeLast(repositoryUrl.Length - repositoryUrl.LastIndexOf('/') - 1).ToArray());
            var workDir = buildStep.WorkDirectory;
            var buildPluginImage = buildStep.BuildPlugin.DockerImageName;//for example "mcr.microsoft.com/dotnet/core/sdk"
            var buildPluginCommand = buildStep.BuildPlugin.Command; //e.g. "dotnet"

            return buildStep
                .PluginCommand
                .TemplateForDocker
                    .Replace("{BUILD_PLUGIN_IMAGE}", buildPluginImage)
                    .Replace("{BUILD_PLUGIN_VERSION}", ":latest")//TODO: from where we take version? for now will be used last version of image
                    .Replace("{BUILD_PLUGIN_COMMAND}", buildPluginCommand)
                    .Replace("{REPOS_NAME}", repositoryName)
                    .Replace("{WORK_DIR_NAME}", workDir)
                    .Replace("{PLUGIN_COMMAND_NAME}", buildStep.PluginCommand.Name);//like "build"
        }

        private async Task CreateDockerFileAsync(string content, string path)
        {
            await using (var outputFile = new StreamWriter(Path.Combine(path, "Dockerfile")))
            {
                await outputFile.WriteAsync(content);
            }
        }
        #endregion

        #region Image
        private async Task PullImageByNameAsync(string imageName)
        {
            try
            {
                await _dockerClient
                    .Images
                    .CreateImageAsync(
                        new ImagesCreateParameters
                        {
                            FromImage = imageName,
                            Tag = "latest"
                        },
                        new AuthConfig(),
                        new Progress<JSONMessage>()
                    );
            }
            catch (Exception e)
            {
                Log.Error(e.Message);
            }
        }

        /// <summary />
        /// <param name="path">Path to directory with Dockerfile</param>
        /// <returns>Name of created image or empty</returns>
        private async Task<string> CreateImageFromRepositoryWithDockerfileAsync(string path)
        {
            await using (var stream = CreateTarballForDockerfileDirectory(path))
            {
                try
                {
                    //Dockerfile has to be in the parent directory of cloned repository. It can be changed later.
                    var imageName = $"image{new Random().Next()}{DateTime.Now.Millisecond}";
                    await _dockerClient
                        .Images
                        .BuildImageFromDockerfileAsync(
                            stream,
                            new ImageBuildParameters()
                            {
                                Tags = new[] { imageName }
                            });
                    return imageName;
                }
                catch (Exception e)
                {
                    Log.Error(e.Message);
                    return string.Empty;
                }
            }
        }
        #endregion

        #region Container
        /// <summary />
        /// <param name="imageName">Name of image that will be used to create container</param>
        /// <param name="port">Expose port</param>
        /// <returns>ID of created container or empty</returns>
        private async Task<string> CreateContainerAsync(string imageName, ushort port)
        {
            return await TryCreateContainerAsync(imageName, port, 0, 100);
        }

        /// <summary>Try to create container until retry count reached maximum retry count</summary>
        /// <param name="imageName">Name of image that will be used to create container</param>
        /// <param name="port">Expose port</param>
        /// <param name="retryCount">Current count of retry to create Docker container</param>
        /// <param name="maxRetryCount"></param>
        /// <returns>ID of created container or empty</returns>
        private async Task<string> TryCreateContainerAsync(string imageName, ushort port, uint retryCount = 0, uint maxRetryCount = 100)
        {
            try
            {
                var createdContainer = await _dockerClient.Containers.CreateContainerAsync(new CreateContainerParameters
                {
                    Image = imageName,
                    ExposedPorts = new Dictionary<string, EmptyStruct>
                    {
                        {
                            port.ToString(), default
                        }
                    },
                    HostConfig = new HostConfig
                    {
                        PortBindings = new Dictionary<string, IList<PortBinding>>
                        {
                            {port.ToString(), new List<PortBinding> {new PortBinding {HostPort = port.ToString()}}}
                        },
                        PublishAllPorts = true
                    }
                });
                return createdContainer.ID;
            }
            catch (DockerContainerNotFoundException)
            {
                //DockerContainerNotFoundException can be caused by some Docker client error, so sometimes should retry the operation
                //But DockerContainerNotFoundException can be caused by incorrect Dockerfile also
                return ++retryCount < maxRetryCount ? await TryCreateContainerAsync(imageName, port, retryCount, maxRetryCount) : string.Empty;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return string.Empty;
            }
        }

        private async Task<bool> RunContainerAsync(string containerId)
        {
            return await _dockerClient.Containers.StartContainerAsync(containerId, new ContainerStartParameters());
        }

        private async Task StopContainerAsync(string containerId)
        {
            await _dockerClient.Containers.StopContainerAsync(containerId, new ContainerStopParameters());
        }

        private async Task RemoveImageAndContainerAsync(string imageName, string containerId)
        {
            await _dockerClient.Containers.RemoveContainerAsync(containerId, new ContainerRemoveParameters());
            await _dockerClient.Images.DeleteImageAsync(imageName, new ImageDeleteParameters());
        }
        #endregion
        
        public string finalLine = "";
        
        private async Task<string> GetLogFromContainer(string containerId)
        {
            // var logStream = await _dockerClient
            //     .Containers
            //     .GetContainerLogsAsync(containerId, new ContainerLogsParameters() { ShowStderr = true, ShowStdout = true });
            // using (var streamReader = new StreamReader(logStream, Encoding.UTF8))
            // {
            //     var logContent = await streamReader.ReadToEndAsync();
            //     return new string(logContent.Where(c => !char.IsControl(c)).ToArray());//TODO: some control chars should not be removed, so need to change filter
            //}

            var logStream = await _dockerClient.Containers.GetContainerLogsAsync(containerId,
                new ContainerLogsParameters
                {
                    Follow = true,
                    ShowStderr = true,
                    ShowStdout = true,
                    Timestamps = true
                }, default);
            using (var reader = new StreamReader(logStream))
            {
                string line = null;
                while ((line = await reader.ReadLineAsync()) != null)
                {
                    var firstSpaceIndex = line.IndexOf("Z ");
                    var gettingDate = line.Substring(0, firstSpaceIndex+1);
                    var firstTwoNumber = gettingDate.IndexOf("2");
                    var finalDate = gettingDate.Substring(firstTwoNumber);
                    var time = DateTime.Parse(finalDate);
                    var message = line.Substring(firstSpaceIndex + 2).TrimStart();
                    var lineToAdd = "[" + time.ToString("G", CultureInfo.CreateSpecificCulture("ru-RU")) + "]" + " " + message;
                    finalLine += lineToAdd;
                    finalLine += Environment.NewLine;
                }
            
                return finalLine;
            }
        }
        #endregion

        #region Tar
        private static Stream CreateTarballForDockerfileDirectory(string directory)
        {
            var tarball = new MemoryStream();
            var files = Directory.GetFiles(directory, "*.*", SearchOption.AllDirectories);

            using var archive = new TarOutputStream(tarball)
            {
                //Prevent the TarOutputStream from closing the underlying memory stream when done
                IsStreamOwner = false
            };

            foreach (var file in files)
            {
                //Replacing slashes as KyleGobel suggested and removing leading /
                string tarName = file.Substring(directory.Length).Replace('\\', '/').TrimStart('/');

                //Let's create the entry header
                var entry = TarEntry.CreateTarEntry(tarName);
                using var fileStream = File.OpenRead(file);
                entry.Size = fileStream.Length;
                archive.PutNextEntry(entry);

                //Now write the bytes of data
                byte[] localBuffer = new byte[32 * 1024];
                while (true)
                {
                    int numRead = fileStream.Read(localBuffer, 0, localBuffer.Length);
                    if (numRead <= 0)
                        break;

                    archive.Write(localBuffer, 0, numRead);
                }

                //Nothing more to do with this entry
                archive.CloseEntry();
            }
            archive.Close();

            //Reset the stream and return it, so it can be used by the caller
            tarball.Position = 0;
            return tarball;
        }
        #endregion

        #region Directory
        private void CloneRepository(string repositoryUrl, string path)
        {
            try
            {
                EnsureExistDirectory(path);
                Repository.Clone(repositoryUrl, path);
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

        public void Dispose()
        {
            _dockerClient.Dispose();
        }
    }
}
