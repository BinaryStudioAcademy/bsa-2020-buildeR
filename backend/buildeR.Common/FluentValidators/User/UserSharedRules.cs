using buildeR.Common.FluentValidators.Shared;
using FluentValidation;

namespace buildeR.Common.FluentValidators.User
{
    public static class UserSharedRulesExtensions
    {
        public static IRuleBuilderOptions<T, string> Username<T>(this IRuleBuilder<T, string> rule)
        {
            return rule
                .NotNull()
                .Length(3, 30)
                .NoDotsOnEdges()
                .NoHyphenOnEdges()
                .NoSpecialCharsExcept('_', '.', '-')
                .NoNonLatinLetters();
        }

        public static IRuleBuilderOptions<T, string> FirstName<T>(this IRuleBuilder<T, string> rule)
        {
            return rule
                .Length(2, 30)
                .NoSpacesOnEdges()
                .NoHyphenOnEdges()
                .NoDigits()
                .NoSpecialCharsExcept('-', ' ')
                .NoNonLatinLetters();
        }

        public static IRuleBuilderOptions<T, string> LastName<T>(this IRuleBuilder<T, string> rule)
        {
            return rule
                .FirstName();
        }

        public static IRuleBuilderOptions<T, string> Bio<T>(this IRuleBuilder<T, string> rule)
        {
            return rule
                .MaximumLength(300)
                .NoNonLatinLetters();
        }
    }
}