using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.Common.Interfaces
{
    public interface IEmailBuilder
    {
        string CreateTemplate(string title, string body);
    }
}
