using buildeR.Common.DTO;
using buildeR.BLL.Interfaces;
using Microsoft.Extensions.Configuration;

namespace buildeR.BLL.Providers
{
    public class EmailBuilder : IEmailBuilder 
    {
        private readonly IConfiguration _configuration;

        public EmailBuilder(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string CreateTemplate(string title, string body)
        {
            string emailText = @$"<tr><td style=""padding: 20px 30px 30px 30px;""><table width=""100%""><tr><td align=""center"">
                                            { title} </td></tr><tr><td></td></tr><tr><td>
                                            { body}</td></tr><tr><td></td></tr></table></td></tr>";
            string header = GenerateHeader();
            string footer = GenerateFooter();
            return header + emailText + footer;
        }

        private string GenerateHeader()
        {
            return @$"<table align=""center"" width=""600"" style=""border: 1px solid #d3d3d3; color: #000000;""><tr><td><img src=""https://i.imgur.com/XlVitBi.png"" alt=""logo"" width=""600"" style=""display: block;""/></td></tr>";
        }

        private string GenerateFooter()
        {
            return @$"<tr><td align=""center""style=""background-color:#F5F5F5;""><img src=""https://i.imgur.com/uXA6DVV.png"" alt=""builder"" height=""50"" style=""display: block;""/> &#169; 2020 buildeR </td></tr></table>";
        }

        public EmailModel GetSignUpLetter(string email, string firstName)
        {
            string baseUrl = _configuration["ClientUrl"];
            string subject = "Successful SignUp";
            string title = @"<b style=""font-size: 20px"">Welcome</b>";
            string body = @$"Hey {firstName}, <br><br> Thank you for signing up with buildeR. We hope you enjoy your time with us.
                          Check your <a href=""{baseUrl}/portal/user"">account</a>
                          and update your profile.<br><br>Cheers,<br>buildeR team";
            return new EmailModel()
            {
                Email = email,
                Subject = subject,
                Title = title,
                Body = body
            };
        }

        public EmailModel GetFeedbackLetter(string email, string userName, string userSubject)
        {
            string subject = userSubject;
            string title = $@"<b style=""font-size: 20px"">Hello, {userName}!</b>";
            string body = @$"We want to thank you for your letter!<br><br>Each of your letters is very important to us! 
                          We have received your letter and will contact you as soon as possible.
                          <br><br>Cheers,<br>buildeR team";
            return new EmailModel()
            {
                Email = email,
                Subject = subject,
                Title = title,
                Body = body
            };
        }
    }
}
