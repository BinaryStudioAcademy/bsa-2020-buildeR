using buildeR.BLL.Interfaces;

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

        [HttpGet("{buildPluginName}/versions/{version}")]
        public async Task<IEnumerable<string>> GetVersionOfBuildPluginByPartOfVersion(string buildPluginName, string version)
        {
            return await _buildPluginService.GetVersionsOfBuildPlugin(buildPluginName, version);
        }
    }
}
