using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(List<string> emails, string subject, string title, string body);
    }     
}
