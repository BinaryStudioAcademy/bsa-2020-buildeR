using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SendGrid.Helpers.Mail;

namespace buildeR.BLL.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(List<string> emails, string subject, string title, string body);
        Task SendEmailAsync(List<string> emails, EmailAddress replyToAddress, string subject, string textMessage);
        string SupportEmail { get; }
        string SenderEmail { get; }
    }     
}
