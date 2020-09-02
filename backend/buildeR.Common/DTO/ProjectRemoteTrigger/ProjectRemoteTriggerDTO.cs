using buildeR.Common.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.Common.DTO.ProjectRemoteTrigger
{
    public class ProjectRemoteTriggerDTO
    {
        public int Id { get; set; }
        public RemoteTriggerType Type { get; set; }
        public string Branch { get; set; }
        public int ProjectId { get; set; }
    }
}
