using buildeR.Common.DTO.BuildHistory;
using buildeR.RabbitMq.Interfaces;

using Docker.DotNet;
using Docker.DotNet.Models;

using ICSharpCode.SharpZipLib.GZip;
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

namespace buildeR.Processor.Services
{
    public class ProcessorService : IProcessorService, IDisposable
    {
        #region Properties\fields
        private readonly IConsumer _consumer;
        private readonly DockerClient _dockerClient;
        private readonly string _pathToProjects;
        private string _pathToFile;

        private string DockerApiUri => IsCurrentOsLinux ? "unix:/var/run/docker.sock" : "npipe://./pipe/docker_engine";
        private bool IsCurrentOsLinux => RuntimeInformation.IsOSPlatform(OSPlatform.Linux);
        private string PathToWorkDirectory => Path.Combine(_pathToFile, "ClonedRepository");
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
            Log.Information(" >>>> Deregister");
        }

        public async Task BuildProjectAsync(ExecutiveBuildDTO build)
        {
            _pathToFile = Path.Combine(_pathToProjects, build.ProjectId.ToString());

            try
            {
                //await RunTestHelloWorldContainerAsync();

                var imageName = await CreateImageFromRepositoryWithDockerfileAsync(build.RepositoryUrl);
                const int port = 8111;//TODO use different port

                var containerId = await CreateContainerAsync(imageName, port);

                if (string.IsNullOrWhiteSpace(imageName) || string.IsNullOrWhiteSpace(containerId))
                    throw new InvalidOperationException($"Image name {imageName}, container ID {containerId}");

                Log.Information($" ================= Image with name '{imageName}' and container with ID [{containerId}] were created");

                await RunContainerAsync(containerId);

                // Need to wait until build will be finished because at the moment Container stops before all commands from Dockerfile are executed
                await Task.Delay(2000);// TODO: fix it. 

                //await _dockerClient.Containers.WaitContainerAsync(containerId);
                await StopContainerAsync(containerId);

                var logs = await GetLogFromContainer(containerId);
                Log.Information($" ================= Logs from container:\n{logs}");


                await RemoveImageAndContainerAsync(imageName, containerId);

                //DeleteClonedRepository(PathToWorkDirectory);
            }
            catch (Exception e)
            {
                Log.Error(e.Message);
            }
        }

        #region Docker
        private async Task RunTestHelloWorldContainerAsync()
        {
            const string imageName = "hello-world";
            await PullImageByNameAsync(imageName);
            var containerId = await CreateContainerAsync(imageName, 7999);
            var logs = await GetLogFromContainer(containerId);
        }

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
        /// <param name="repositoryUrl">Repository to clone and to dockerize</param>
        /// <returns>Name of created image or empty</returns>
        private async Task<string> CreateImageFromRepositoryWithDockerfileAsync(string repositoryUrl)
        {
            CloneRepository(repositoryUrl);

            await using (var stream = CreateTarballForDockerfileDirectory(PathToWorkDirectory))
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
        private async Task<string> CreateContainerAsync(string imageName, int port)
        {
            return await TryCreateContainerAsync(imageName, port, 0, 100);
        }

        /// <summary>Try to create container until retry count reached maximum retry count</summary>
        /// <param name="imageName">Name of image that will be used to create container</param>
        /// <param name="port">Expose port</param>
        /// <param name="retryCount">Current count of retry to create Docker container</param>
        /// <param name="maxRetryCount"></param>
        /// <returns>ID of created container or empty</returns>
        private async Task<string> TryCreateContainerAsync(string imageName, int port, int retryCount = 0, int maxRetryCount = 100)
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

        private async Task<string> GetLogFromContainer(string containerId)
        {

            var logStream = await _dockerClient
                .Containers
                .GetContainerLogsAsync(containerId, new ContainerLogsParameters() { ShowStderr = true, ShowStdout = true });
            using (var streamReader = new StreamReader(logStream, Encoding.UTF8))
            {
                var logContent = await streamReader.ReadToEndAsync();
                return new string(logContent.Where(c => !char.IsControl(c)).ToArray());
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

        #region Tar.gz
        private string CreateTarGzFileFromFolder(string sourceDirectory, string tgzFileName, string targetDirectory, bool deleteSourceDirectoryUponCompletion = false)
        {
            if (!tgzFileName.EndsWith(".tar"))
            {
                tgzFileName = $"{tgzFileName}.tar";
            }

            using var outStream = File.Create(Path.Combine(targetDirectory, tgzFileName));
            using (var gzoStream = new GZipOutputStream(outStream))
            {
                var tarArchive = TarArchive.CreateOutputTarArchive(gzoStream);

                tarArchive.RootPath = sourceDirectory.Replace('\\', '/');
                if (tarArchive.RootPath.EndsWith("/"))
                {
                    tarArchive.RootPath = tarArchive.RootPath.Remove(tarArchive.RootPath.Length - 1);
                }

                AddDirectoryFilesToTarGz(tarArchive, sourceDirectory);

                if (deleteSourceDirectoryUponCompletion)
                {
                    File.Delete(sourceDirectory);
                }

                var tgzPath = (tarArchive.RootPath + ".tar").Replace('/', '\\');

                tarArchive.Close();
                return tgzPath;
            }
        }

        private void AddDirectoryFilesToTarGz(TarArchive tarArchive, string sourceDirectory)
        {
            AddDirectoryFilesToTarGz(tarArchive, sourceDirectory, string.Empty);
        }

        private void AddDirectoryFilesToTarGz(TarArchive tarArchive, string sourceDirectory, string currentDirectory)
        {
            var pathToCurrentDirectory = Path.Combine(sourceDirectory, currentDirectory);
            foreach (var filePath in Directory.GetFiles(pathToCurrentDirectory))
            {
                var tarEntry = TarEntry.CreateEntryFromFile(filePath);

                tarEntry.Name = filePath.Replace(sourceDirectory, "");

                if (tarEntry.Name.StartsWith('\\'))
                {
                    tarEntry.Name = tarEntry.Name.Substring(1);
                }
                tarArchive.WriteEntry(tarEntry, true);
            }

            foreach (var directory in Directory.GetDirectories(pathToCurrentDirectory))
            {
                AddDirectoryFilesToTarGz(tarArchive, sourceDirectory, directory);
            }
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
            _dockerClient.Dispose();
        }
    }
}
