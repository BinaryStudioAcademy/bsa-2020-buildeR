using buildeR.Common.DTO.User;
using FluentValidation;

namespace buildeR.Common.FluentValidatiors
{
    public class UserValidator : AbstractValidator<UserDTO>
    {
        public UserValidator()
        {
            RuleFor(u => u.Email).EmailAddress();
            // ...
        }
    }
}