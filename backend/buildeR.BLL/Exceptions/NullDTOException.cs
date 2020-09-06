using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.BLL.Exceptions
{
    public class NullDTOException: Exception
    {
        public NullDTOException(Type type): base($"Cannot operate with null {type.Name} DTO")
        { }
    }
}
