using buildeR.BLL.Interfaces;

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
    }
}
