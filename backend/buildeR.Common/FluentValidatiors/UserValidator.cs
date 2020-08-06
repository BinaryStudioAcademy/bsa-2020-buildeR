using buildeR.DAL.Entities;
using FluentValidation;

namespace buildeR.Common.FluentValidatiors
{
    public class UserValidator : AbstractValidator<User>
    {
        public UserValidator()
        {
            RuleFor(u => u.Email).EmailAddress();
            // ...
        }
    }
}