using buildeR.Common.DTO.Project;
using FluentValidation;

namespace buildeR.Common.FluentValidators.Project
{
    public class ProjectDtoValidator: AbstractValidator<ProjectDTO>
    {
        public ProjectDtoValidator()
        {
            RuleFor(p => p.Description).Description();
            RuleFor(p => p.Name).Name();
        }
    }
}