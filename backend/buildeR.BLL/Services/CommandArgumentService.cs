using AutoMapper;

using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;

namespace buildeR.BLL.Services
{
    public class CommandArgumentService : BaseCrudService<CommandArgument, CommandArgumentDTO, CommandArgumentDTO>, ICommandArgumentService
    {
        public CommandArgumentService(BuilderContext context, IMapper mapper) : base(context, mapper)
        {
        }
    }
}
