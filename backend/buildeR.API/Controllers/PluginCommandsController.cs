using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.BuildPlugin;
using buildeR.Common.DTO.PluginCommand;
using Microsoft.AspNetCore.Mvc;

using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PluginCommandsController : ControllerBase
    {
        private readonly IPluginCommandService _pluginCommandService;

        public PluginCommandsController(IPluginCommandService pluginCommandService)
        {
            _pluginCommandService = pluginCommandService;
        }

        [HttpGet]
        public async Task<IEnumerable<PluginCommandDTO>> GetAll()
        {
            return await _pluginCommandService.GetAll();
        }

        [HttpGet("{id}")]
        public async Task<PluginCommandDTO> GetById(int id)
        {
            return await _pluginCommandService.GetCommandById(id);
        }

        [HttpPost]
        public async Task<PluginCommandDTO> Create(NewPluginCommandDTO pluginCommand)
        {
            return await _pluginCommandService.Create(pluginCommand);
        }

        [HttpPut]
        public async Task Update(PluginCommandDTO buildPlugin)
        {
            await _pluginCommandService.Update(buildPlugin);
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _pluginCommandService.Delete(id);
        }
    }
}
