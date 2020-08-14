using buildeR.Common.DTO.User;
using buildeR.Common.FluentValidators.Shared;
using FluentValidation;

namespace buildeR.Common.FluentValidators.User
{
    public class UserDtoValidator : AbstractValidator<UserDTO>
    {
        public UserDtoValidator()
        {
            RuleFor(u => u.Username).Username();
            RuleFor(u => u.LastName).LastName().CanBeNull();
            RuleFor(u => u.FirstName).FirstName().CanBeNull();
            RuleFor(u => u.Email).Email();
            RuleFor(u => u.Bio).Bio().CanBeNull();
        }
    }
}