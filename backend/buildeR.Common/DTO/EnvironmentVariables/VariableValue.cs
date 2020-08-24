using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.Common.DTO.EnvironmentVariables
{
    public class VariableValue
    {   
        public string Name { get; set; }
        public string Value { get; set; }
        public bool IsSecret { get; set; }
    }
}
