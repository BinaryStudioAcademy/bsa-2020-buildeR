using System;
using System.Net.Mail;
using buildeR.Common.FluentValidators.Shared;
using FluentValidation;
using SendGrid.Helpers.Mail;
using static buildeR.Common.FluentValidators.Shared.SpecialCharactersRules;

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

        public static IRuleBuilderOptions<T, string> CustomEmail<T>(this IRuleBuilder<T, string> rule)
        {
            static bool ValidEmail(string input)
            {
                try
                {
                    var m = new EmailAddress(input);

                    return true;
                }
                catch (FormatException)
                {
                    return false;
                }
            }

            return rule
                .Must(ValidEmail)
                .NoNonLatinLetters();
        }
        
        public static IRuleBuilderOptions<T, string> Bio<T>(this IRuleBuilder<T, string> rule)
        {
            return rule
                .MaximumLength(300)
                .NoNonLatinLetters();
        }
    }
}