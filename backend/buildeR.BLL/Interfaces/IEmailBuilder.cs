using buildeR.Common.DTO;

namespace buildeR.BLL.Interfaces
{
    public interface IEmailBuilder
    {
        string CreateTemplate(string title, string body);
        EmailModel GetSignUpLetter(string email, string firstName);
        EmailModel GetFeedbackLetter(string email, string userName, string subject);
        EmailModel GetInviteGroupLetter(string email, string firstName);
    }
}
