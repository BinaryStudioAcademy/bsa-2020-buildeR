using System;
using System.Net.Mail;
using FluentValidation;

namespace buildeR.Common.FluentValidators.Shared
{
    public static class EmailRule
    {
        public static IRuleBuilderOptions<T, string> Email<T>(this IRuleBuilder<T, string> rule)
        {
            static bool ValidEmail(string input)
            {
                try
                {
                    var m = new MailAddress(input);

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
    }
}