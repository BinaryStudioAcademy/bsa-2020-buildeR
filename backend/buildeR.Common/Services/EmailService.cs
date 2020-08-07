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
        private readonly string _senderEmail;
        private readonly string _senderName;
        private readonly string _apiKey;
        private readonly IEmailBuilder _builder;
        private readonly SendGridClient _client;
        public EmailService(IEmailBuilder builder)
        {
            _apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
            _senderEmail = Environment.GetEnvironmentVariable("SENDGRID_EMAIL");
            _senderName = Environment.GetEnvironmentVariable("SENDGRID_Name");
            _builder = builder;
            _client = new SendGridClient(_apiKey);
        }
        public async Task SendEmailAsync(List<string> emails, string subject, string title, string body)
        {

            SendGridMessage msg = new SendGridMessage()
            {
                From = new EmailAddress(_senderEmail, _senderName),
                Subject = subject,
                HtmlContent = _builder.CreateTemplate(title, body)
            };

            foreach (var email in emails)
            {
                msg.AddTo(new EmailAddress(email));
            }

            await _client.SendEmailAsync(msg);
        }
    }
}
