using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using buildeR.Common.Interfaces;
using Microsoft.Extensions.Configuration;
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
        
        public EmailService(IEmailBuilder builder, IConfiguration configuration)
        {
            _builder = builder;

            var sendgridSection = configuration.GetSection("Sendgrid");
            _apiKey = sendgridSection["SENDGRID_API_KEY"];
            _senderEmail = sendgridSection["SENDGRID_EMAIL"];
            _senderName = sendgridSection["SENDGRID_Name"];
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
    }
}
