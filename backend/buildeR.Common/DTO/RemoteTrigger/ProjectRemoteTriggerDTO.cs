using buildeR.Common.Enums;

namespace buildeR.Common.DTO.RemoteTrigger
{
    public class ProjectRemoteTriggerDTO
    {
        public RemoteTriggerType Type { get; set; }
        public string Branch { get; set; }
        public int ProjectId { get; set; }
    }
}
