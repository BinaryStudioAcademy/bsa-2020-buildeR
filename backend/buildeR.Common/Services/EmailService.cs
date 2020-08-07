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
        public Task SendEmailAsync(List<string> emails, string subject, string title, string body)
        {

            return Execute(Environment.GetEnvironmentVariable("SENDGRID_API_KEY"), emails, subject, title, body);
        }
        private string CreateTemplate(string title, string body)
        {
            string htmlContent = @$"<table align=""center"" border=""1"" width=""600"" bordercolor=""#000000"" style=""color: #000000;""><tr><td align = ""center"" style = "" padding: 40px 0 30px 0;
                                            background: url(https://img5.goodfon.ru/wallpaper/nbig/2/27/zelenyi-fon-tekstura-abstract-background-green-color.jpg);display: block;""><h1 style = ""padding-top: 0.1em; font-size: 5em;"">
                                            buildeR </h1></td></tr><tr><td style = ""padding: 40px 30px 40px 30px;"" ><table width = ""100%""><tr><td>
                                            {title} </td></tr><tr><td></td></tr><tr><td>
                                            {body} </td></tr><tr><td></td></tr></table></td></tr><tr><td align = ""center"" style = ""background-color:#F5F5F5; padding: 0.1em; font-size: 1em;"">buildeR</td></tr></table>";
            
            return htmlContent;
        }

        private async Task Execute(string apiKey, List<string> emails, string subject, string title, string body)
        {
            var client = new SendGridClient(apiKey);
            string adminEmail = Environment.GetEnvironmentVariable("SENDGRID_EMAIL");
            string adminName = Environment.GetEnvironmentVariable("SENDGRID_Name");

            var msg = new SendGridMessage()
            {
                From = new EmailAddress(adminEmail, adminName),
                Subject = subject,
                HtmlContent = CreateTemplate(title, body)
            };

            foreach (var email in emails)
            {
                msg.AddTo(new EmailAddress(email));
            }

            await client.SendEmailAsync(msg);
        }
    }
}
