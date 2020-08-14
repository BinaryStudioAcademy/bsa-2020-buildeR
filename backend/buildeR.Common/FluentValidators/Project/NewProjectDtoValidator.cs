using buildeR.Common.DTO.Project;
using buildeR.Common.FluentValidators.Shared;
using FluentValidation;

namespace buildeR.Common.FluentValidators.Project
{
    public class NewProjectDtoValidator : AbstractValidator<NewProjectDTO>
    {
        public NewProjectDtoValidator()
        {
            RuleFor(p => p.Description).Description().CanBeNull();
            RuleFor(p => p.Name).Name();
        }
    }
}