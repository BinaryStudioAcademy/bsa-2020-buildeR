﻿using buildeR.Common.DTO;

namespace buildeR.BLL.Interfaces
{
    public interface IEmailBuilder
    {
        string CreateTemplate(string title, string body);
        EmailModel GetSignUpLetter(string email, string firstName);
        // EmailModel GetInviteGroupLetter(string email, string firstName);
    }
}
