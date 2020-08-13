using buildeR.Common.DTO.Project;
using FluentValidation;

namespace buildeR.Common.FluentValidators.Project
{
    public class NewProjectDtoValidator : AbstractValidator<NewProjectDTO>
    {
        public NewProjectDtoValidator()
        {
            RuleFor(p => p.Description).Description();
            RuleFor(p => p.Name).Name();
        }
    }
}