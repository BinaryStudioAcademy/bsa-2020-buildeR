using System;
using System.Collections.Generic;
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
        private readonly SendGridClient _client;
        private readonly IConfiguration _configuration;
        public EmailService(IEmailBuilder builder, IConfiguration configuration)
        {
            _apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
            _senderEmail = Environment.GetEnvironmentVariable("SENDGRID_EMAIL");
            _senderName = Environment.GetEnvironmentVariable("SENDGRID_Name");
            _builder = builder;
            _client = new SendGridClient(_apiKey);
            _configuration = configuration;
        }
        public async Task ConfirmRegistration(string email, string firstName)
        {
            string baseUrl = _configuration.GetValue<string>("ClientUrl");
            string link = "http://localhost:4200/portal/user";
            string subject = "Successful SignUp";
            string title = @"<b style=""font-size: 20px"">Welcome</b>";
            string body = @$"Hey {firstName}, <br><br> Thank you for signing up with buildeR. We hope you enjoy your time with us.
                Check your <a href={link}>account</a>
                    and update your profile.<br><br>Cheers,<br>buildeR team";
            List<string> emails = new List<string>
            {
                email
            };
            await SendEmailAsync(emails, subject, title, body);
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
