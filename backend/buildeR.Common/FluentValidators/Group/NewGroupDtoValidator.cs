using buildeR.Common.DTO.Group;
using FluentValidation;

namespace buildeR.Common.FluentValidators.Group
{
    public class NewGroupDtoValidator : AbstractValidator<NewGroupDTO>
    {
        public NewGroupDtoValidator()
        {
            // RuleFor(p => p.Description).Description();
            RuleFor(p => p.Name).Name();
        }
    }
}