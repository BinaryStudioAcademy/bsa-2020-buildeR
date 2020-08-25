using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace buildeR.BLL.Providers
{
    public class EmailService : IEmailService
    {
        private readonly string _senderEmail;
        private readonly string _senderName;
        private readonly string _apiKey;
        public string SupportEmail { get; private set; }
        private readonly IEmailBuilder _builder;
        
        public EmailService(IEmailBuilder builder, IConfiguration configuration)
        {
            _builder = builder;

            _apiKey = configuration["SENDGRID_API_KEY"];
            _senderEmail = configuration["SENDGRID_EMAIL"];
            _senderName = configuration["SENDGRID_Name"];
            SupportEmail = configuration["SupportEmailAddress"];
        }

        public async Task SendEmailAsync(List<string> emails, string subject, string title, string body)
        {

            var msg = new SendGridMessage()
            {
                From = new EmailAddress(_senderEmail, _senderName),
                Subject = subject,
                HtmlContent = _builder.CreateTemplate(title, body),
            };

            msg.AddTos(emails.Select(email => new EmailAddress(email)).ToList());

            var client = new SendGridClient(_apiKey);
            await client.SendEmailAsync(msg);
        }
        public async Task SendEmailAsync(List<string> emails, EmailAddress replyToAddress, string subject, string textMessage)
        {
            var msg = new SendGridMessage()
            {
                From = new EmailAddress(_senderEmail, _senderName),
                Subject = subject,
                HtmlContent = $"<p>{textMessage}</p>",
                ReplyTo = replyToAddress
            };
            
            msg.AddTos(emails.Select(email => new EmailAddress(email)).ToList());

            var client = new SendGridClient(_apiKey);
            await client.SendEmailAsync(msg);
        }
    }
}
