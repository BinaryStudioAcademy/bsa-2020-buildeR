using buildeR.Common.DTO.PluginCommand;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IPluginCommandService
    {
        Task<PluginCommandDTO> GetCommandById(int id);
        Task<IEnumerable<PluginCommandDTO>> GetAll();
        Task<IEnumerable<PluginCommandDTO>> GetCommandsByPluginId();
        Task<PluginCommandDTO> Create(NewPluginCommandDTO pluginCommand);
        Task Update(PluginCommandDTO pluginCommand);
        Task Delete(int id);
    }
}
