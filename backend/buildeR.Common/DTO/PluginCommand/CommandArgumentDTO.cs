using buildeR.Common.DTO.BuildStep;

namespace buildeR.Common.DTO
{
    public class CommandArgumentDTO
    {
        public int Id { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
        public int BuildStepId { get; set; }
    }
}
