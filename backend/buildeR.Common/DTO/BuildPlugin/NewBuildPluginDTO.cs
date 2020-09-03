namespace buildeR.Common.DTO.BuildPlugin
{
    public sealed class NewBuildPluginDTO
    {
        public string PluginName { get; set; }
        public string Command { get; set; }
        public string DockerImageName { get; set; }
        public string DockerRegistryName { get; set; }
    }
}
