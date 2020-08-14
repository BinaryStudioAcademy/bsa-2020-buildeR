using buildeR.Common.DTO.User;
using buildeR.Common.FluentValidators.Shared;
using FluentValidation;

namespace buildeR.Common.FluentValidators.User
{
    public class NewUserDtoValidator: AbstractValidator<NewUserDTO>
    {
        public NewUserDtoValidator()
        {
            RuleFor(u => u.Username).Username();
            RuleFor(u => u.LastName).LastName().CanBeNull();
            RuleFor(u => u.FirstName).FirstName().CanBeNull();
            RuleFor(u => u.Email).Email();
        }
    }
}