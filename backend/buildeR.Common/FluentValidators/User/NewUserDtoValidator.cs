using buildeR.Common.DTO.User;
using FluentValidation;

namespace buildeR.Common.FluentValidators.User
{
    public class NewUserDtoValidator: AbstractValidator<NewUserDTO>
    {
        public NewUserDtoValidator()
        {
            RuleFor(u => u.Username).Username();
            RuleFor(u => u.LastName).LastName();
            RuleFor(u => u.FirstName).FirstName();
            RuleFor(u => u.Email).CustomEmail();
            RuleFor(u => u.Bio).Bio();
        }
    }
}