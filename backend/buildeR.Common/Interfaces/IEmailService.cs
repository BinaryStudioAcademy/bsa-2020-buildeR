using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.Common.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(List<string> emails, string subject, string title, string body);
        Task ConfirmRegistration(string email, string firstName);
    }     
}
