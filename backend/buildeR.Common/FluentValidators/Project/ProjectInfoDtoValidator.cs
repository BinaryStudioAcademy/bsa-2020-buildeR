using buildeR.Common.DTO.Project;
using FluentValidation;

namespace buildeR.Common.FluentValidators.Project
{
    public class ProjectInfoDtoValidator: AbstractValidator<ProjectInfoDTO>
    {
        public ProjectInfoDtoValidator()
        {
            RuleFor(p => p.Name).Name();
        }
    }
}