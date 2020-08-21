using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.Common.DTO.EnvironmentVariables
{
    public class EnvironmentVariableDTO
    {
        public int ProjectId { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
    }
}
