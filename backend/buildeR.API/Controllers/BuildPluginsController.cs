using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.BuildPlugin;
using Microsoft.AspNetCore.Mvc;

using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BuildPluginsController : ControllerBase
    {
        private readonly IBuildPluginService _buildPluginService;

        public BuildPluginsController(IBuildPluginService buildPluginService)
        {
            _buildPluginService = buildPluginService;
        }

        [HttpGet]
        public async Task<IEnumerable<BuildPluginDTO>> GetAll()
        {
            return await _buildPluginService.GetAll();
        }

        [HttpGet("{id}")]
        public async Task<BuildPluginDTO> GetById(int id)
        {
            return await _buildPluginService.GetPluginById(id);
        }

        [HttpPost]
        public async Task<BuildPluginDTO> Create(NewBuildPluginDTO buildPlugin)
        {
            return await _buildPluginService.Create(buildPlugin);
        }

        [HttpPut]
        public async Task Update(BuildPluginDTO buildPlugin)
        {
            await _buildPluginService.Update(buildPlugin);
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _buildPluginService.Delete(id);
        }

        [HttpGet("{buildPluginName}/versions/{version}")]
        public async Task<IEnumerable<string>> GetVersionOfBuildPluginByPartOfVersion(string buildPluginName, string version)
        {
            return await _buildPluginService.GetVersionsOfBuildPlugin(buildPluginName, version);
        }
    }
}
