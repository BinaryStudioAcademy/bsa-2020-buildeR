using buildeR.Common.Interfaces;

namespace buildeR.Common.Services
{
    public class EmailBuilder: IEmailBuilder 
    {
        public string CreateTemplate(string title, string body)
        {
            string emailText = @$"<tr><td style=""padding: 20px 30px 30px 30px;""><table width=""100%""><tr><td>
                                            { title} </td></tr><tr><td></td></tr><tr><td>
                                            { body}</td></tr><tr><td></td></tr></table></td></tr>";
            string header = GenerateHeader();
            string footer = GenerateFooter();
            return header + emailText + footer;
        }
        private string GenerateHeader()
        {
            return @$"<table align=""center"" width=""600"" style=""border: 1px solid #d3d3d3; color: #000000;""><tr><td><img src=""https://trello-attachments.s3.amazonaws.com/5f306ff96e7081855d9b3f97/390x108/cc17b05385e2cb5d96c9f951f6f96464/buildeR_logo_3_%282%29.png"" alt=""logo"" width=""600"" style=""display: block;""/></td></tr>";
        }
        private string GenerateFooter()
        {
            return @$"<tr><td align=""center""style=""background-color:#F5F5F5;""><img src=""https://trello-attachments.s3.amazonaws.com/5f306ff96e7081855d9b3f97/377x311/e629385942f58290679dbbed09187d06/buildeR_logo_2.png"" alt=""builder"" width=""50"" height=""45"" style=""display: block;""/> &#169; 2020 buildeR </td></tr></table>";
        }
    }
}
