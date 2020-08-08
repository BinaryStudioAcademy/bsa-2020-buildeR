using buildeR.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.Common.Services
{
    public class EmailBuilder: IEmailBuilder 
    {
        public string CreateTemplate(string title, string body)
        {
            string emailText = @$"<tr><td style=""padding: 40px 30px 40px 30px;""><table width=""100%""><tr><td>
                                            { title} </td></tr><tr><td></td></tr><tr><td>
                                            { body}</td></tr><tr><td></td></tr></table></td></tr>";
            string header = GenerateHeader();
            string footer = GenerateFooter();
            return header + emailText + footer;
        }
        private string GenerateHeader()
        {
            return @$"<table align=""center"" width=""600"" style=""border: 1px solid gray; color: #000000;""><tr><td align =""center"" style =""padding: 40px 0 30px 0;
                       background: url(https://img5.goodfon.ru/wallpaper/nbig/2/27/zelenyi-fon-tekstura-abstract-background-green-color.jpg);display: block;""><h1 style=""padding-top: 0.1em; font-size: 5em;"">
                       buildeR</h1></td></tr>";
        }
        private string GenerateFooter()
        {
            return @$"<tr><td align=""center""style=""background-color:#F5F5F5; padding: 0.5em; font-size: 1em;"">buildeR</td></tr></table>";
        }
    }
}
