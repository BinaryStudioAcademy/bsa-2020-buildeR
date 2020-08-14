using buildeR.Common.DTO.Group;
using FluentValidation;

namespace buildeR.Common.FluentValidators.Group
{
    public class GroupDtoValidator: AbstractValidator<GroupDTO>
    {
        public GroupDtoValidator()
        {
            // RuleFor(p => p.Description).Description();
            RuleFor(p => p.Name).Name();
        }
    }
}