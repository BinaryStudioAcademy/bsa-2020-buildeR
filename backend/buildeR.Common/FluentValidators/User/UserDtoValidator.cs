using buildeR.Common.DTO.User;
using FluentValidation;
using FluentValidation.Validators;

namespace buildeR.Common.FluentValidators.User
{
    public class UserDtoValidator : AbstractValidator<UserDTO>
    {
        public UserDtoValidator()
        {
            RuleFor(u => u.Username).Username();
            RuleFor(u => u.LastName).LastName();
            RuleFor(u => u.FirstName).FirstName();
            RuleFor(u => u.Email).CustomEmail();
            RuleFor(u => u.Bio).Bio();
        }
    }
}