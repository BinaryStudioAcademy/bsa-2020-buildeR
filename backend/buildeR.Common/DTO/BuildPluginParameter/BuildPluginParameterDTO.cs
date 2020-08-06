namespace buildeR.Common.DTO.BuildPluginParameter
{
    public sealed class BuildPluginParameterDTO
    {
        public int Id { get; set; }
        public int BuildStepId { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
    }
}
