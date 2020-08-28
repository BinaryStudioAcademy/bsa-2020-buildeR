using AutoMapper;

using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using System;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class CommandArgumentService : BaseCrudService<CommandArgument, CommandArgumentDTO, CommandArgumentDTO>, ICommandArgumentService
    {
        public CommandArgumentService(BuilderContext context, IMapper mapper) : base(context, mapper)
        {
        }
        public async Task Update(CommandArgumentDTO commandArgument)
        {
            if (commandArgument == null)
            {
                throw new ArgumentNullException();
            }

            await base.UpdateAsync(commandArgument);
        }
    }
}
