using buildeR.Common.DTO.Project;
using buildeR.Common.FluentValidators.Shared;
using FluentValidation;

namespace buildeR.Common.FluentValidators.Project
{
    public class ProjectDtoValidator: AbstractValidator<ProjectDTO>
    {
        public ProjectDtoValidator()
        {
            RuleFor(p => p.Description).Description().CanBeNull();
            RuleFor(p => p.Name).Name();
        }
    }
}