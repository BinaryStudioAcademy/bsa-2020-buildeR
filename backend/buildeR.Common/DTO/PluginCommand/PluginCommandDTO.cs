using buildeR.Common.DTO.BuildPlugin;

namespace buildeR.Common.DTO.PluginCommand
{
    public sealed class PluginCommandDTO
    {
        public int Id { get; set; }
        public int PluginId { get; set; }
        public string Name { get; set; }
        public string TemplateForDocker { get; set; }

        public BuildPluginDTO Plugin { get; set; }
    }
}
