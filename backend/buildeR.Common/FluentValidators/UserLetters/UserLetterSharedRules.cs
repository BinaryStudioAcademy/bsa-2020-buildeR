using buildeR.Common.FluentValidators.Shared;
using FluentValidation;

namespace buildeR.Common.FluentValidators.UserLetters
{
    public static class UserLetterSharedRules
    {
        public static IRuleBuilderOptions<T, string> Username<T>(this IRuleBuilder<T, string> rule)
        {
            return rule
                .NotNull()
                .Length(3, 30)
                .NoDotsOnEdges()
                .NoHyphenOnEdges()
                .NoSpecialCharsExcept('_', '.', '-', '\'')
                .NoNonLatinLetters();
        }
        
        public static IRuleBuilderOptions<T, string> Subject<T>(this IRuleBuilder<T, string> rule)
        {
            return rule
                .NotNull()
                .Length(4, 200)
                .NoNonLatinLetters();
        }
        
        public static IRuleBuilderOptions<T, string> Description<T>(this IRuleBuilder<T, string> rule)
        {
            return rule
                .NotNull()
                .Length(4, 1000)
                .NoNonLatinLetters();
        }
    }
}