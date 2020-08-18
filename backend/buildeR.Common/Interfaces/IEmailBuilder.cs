using buildeR.Common.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.Common.Interfaces
{
    public interface IEmailBuilder
    {
        string CreateTemplate(string title, string body);
        EmailModel GetSignUpLetter(string email, string firstName);
    }
}
