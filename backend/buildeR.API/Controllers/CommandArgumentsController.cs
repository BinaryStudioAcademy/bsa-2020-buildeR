using buildeR.BLL.Interfaces;
using buildeR.Common.DTO;
using Microsoft.AspNetCore.Mvc;

using System.Threading.Tasks;

namespace buildeR.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CommandArgumentsController : ControllerBase
    {
        private readonly ICommandArgumentService _commandArgumentService;
        public CommandArgumentsController(ICommandArgumentService commandArgumentService)
        {
            _commandArgumentService = commandArgumentService;
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _commandArgumentService.RemoveAsync(id);
        }

        [HttpPut]
        public async Task Update(CommandArgumentDTO commandArgument)
        {
            await _commandArgumentService.UpdateAsync(commandArgument);
        }
    }
}
