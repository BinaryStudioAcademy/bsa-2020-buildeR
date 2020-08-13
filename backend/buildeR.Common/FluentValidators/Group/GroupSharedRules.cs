using buildeR.Common.FluentValidators.Shared;
using FluentValidation;

namespace buildeR.Common.FluentValidators.Group
{
    public static class GroupSharedRules
    {
        public static IRuleBuilderOptions<T, string> Name<T>(this IRuleBuilder<T, string> rule)
        {
            return rule
                .NotNull()
                .Length(4, 32)
                .NoDotsOnEdges()
                .NoHyphenOnEdges()
                .NoSpecialCharsExcept(' ', '-', '.', '_')
                .NoNonLatinLetters();
        }
        
        public static IRuleBuilderOptions<T, string> Description<T>(this IRuleBuilder<T, string> rule)
        {
            return rule
                .MaximumLength(300)
                .NoNonLatinLetters();
        }
    }
}