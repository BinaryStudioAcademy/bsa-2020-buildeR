using buildeR.Common.FluentValidators.Shared;
using buildeR.Common.DTO;
using FluentValidation;

namespace buildeR.Common.FluentValidators.UserLetters
{
    public class UserLetterValidator : AbstractValidator<UserLetterDTO>
    {
        public UserLetterValidator()
        {
            RuleFor(u => u.UserName).Username();
            RuleFor(u => u.UserEmail).Email();
            RuleFor(u => u.Subject).Subject();
            RuleFor(u => u.Description).Description();
        }
    }
}