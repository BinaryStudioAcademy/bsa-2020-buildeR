using System.Text.RegularExpressions;
using FluentValidation;

namespace buildeR.Common.FluentValidators.Shared
{
    public static class DigitsRules
    {
        private static readonly Regex HasDigit = new Regex(@"\d");

        public static IRuleBuilderOptions<T, string> NoDigits<T>(this IRuleBuilder<T, string> rule)
        {
            return rule
                .Must(input => !HasDigit.IsMatch(input));
        }
    }
}