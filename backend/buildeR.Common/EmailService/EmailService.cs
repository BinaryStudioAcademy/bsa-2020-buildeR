using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace buildeR.Common.EmailService
{
    public class EmailSender
    {
        public async Task SendEmailAsync(string email, string subject, string message, byte[] attachmentArray = null)
        {
            var apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("test@example.com", "Example User");
            subject = "Sending with Twilio SendGrid is Fun";
            var to = new EmailAddress("test@example.com", "Example User");
            var plainTextContent = "and easy to do anywhere, even with C#";
            var htmlContent = "<strong>and easy to do anywhere, even with C#</strong>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg).ConfigureAwait(false);
        }
       
        //public async Task SendEmailAsync(string email, string subject, string message, byte[] attachmentArray = null)
        //{
        //    var emailMessage = new MimeMessage();

        //    emailMessage.From.Add(new MailboxAddress("Site administration", AdminEmail));
        //    emailMessage.To.Add(new MailboxAddress("", email));
        //    emailMessage.Subject = subject;

        //    if (attachmentArray == null)
        //    {
        //        emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
        //        {
        //            Text = message
        //        };
        //    }
        //    else
        //    {
        //        var multipart = new Multipart("mixed");
        //        multipart.Add(new TextPart(MimeKit.Text.TextFormat.Html)
        //        {
        //            Text = message
        //        });

        //        var attachment = new MimePart("image", "gif")
        //        {
        //            Content = new MimeContent(new MemoryStream(attachmentArray), ContentEncoding.Default),
        //            ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
        //            ContentTransferEncoding = ContentEncoding.Base64
        //        };

        //        multipart.Add(attachment);

        //        emailMessage.Body = multipart;
        //    }

        //    using (var client = new SmtpClient())
        //    {
        //        await client.ConnectAsync("smtp.gmail.com", 25, false);

        //        try
        //        {
        //            await client.AuthenticateAsync(AdminEmail, AdminPassword);
        //        }
        //        catch (MailKit.Security.AuthenticationException)
        //        {
        //            return;
        //        }

        //        await client.SendAsync(emailMessage);
        //        await client.DisconnectAsync(true);
        //    }
        //}
    }
    public class EmailService : IEmailService
    {
        public Task SendEmailAsync(List<string> emails, string subject, string message)
        {

            return Execute(Environment.GetEnvironmentVariable("SENDGRID_API_KEY"), subject, message, emails);
        }

        public Task Execute(string apiKey, string subject, string message, List<string> emails)
        {
            var client = new SendGridClient(apiKey);
            var msg = new SendGridMessage()
            {
                From = new EmailAddress("noreply@domain.com", "User name"),
                Subject = subject,
                PlainTextContent = message
            };

            foreach (var email in emails)
            {
                msg.AddTo(new EmailAddress(email));
            }

            Task response = client.SendEmailAsync(msg);
            return response;
        }
    }
}
