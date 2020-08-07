using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using buildeR.Common.Interfaces;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace buildeR.Common.Services
{
    
    public class EmailService : IEmailService
    {
        public Task SendEmailAsync(List<string> emails, string subject, string message)
        {

            return Execute(Environment.GetEnvironmentVariable("SENDGRID_API_KEY"), subject, message, emails);
        }

        private async Task Execute(string apiKey, string subject, string message, List<string> emails)
        {
            var client = new SendGridClient(apiKey);
            string adminEmail = Environment.GetEnvironmentVariable("SENDGRID_EMAIL");
            string adminName = Environment.GetEnvironmentVariable("SENDGRID_Name");
            var msg = new SendGridMessage()
            {
                From = new EmailAddress(adminEmail, adminName),
                Subject = subject,
                PlainTextContent = message
            };

            foreach (var email in emails)
            {
                msg.AddTo(new EmailAddress(email));
            }

            await client.SendEmailAsync(msg);
        }
    }
}
