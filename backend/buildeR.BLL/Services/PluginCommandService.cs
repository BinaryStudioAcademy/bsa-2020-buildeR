using AutoMapper;
using buildeR.BLL.Exceptions;
using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.BuildPlugin;
using buildeR.Common.DTO.PluginCommand;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class PluginCommandService : BaseCrudService<PluginCommand, PluginCommandDTO, NewPluginCommandDTO>, IPluginCommandService
    {
        private readonly BuilderContext _context;
        private readonly IMapper _mapper;

        public PluginCommandService(BuilderContext context, IMapper mapper) : base(context, mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PluginCommandDTO>> GetAll()
        {
            return await base.GetAllAsync();
        }

        public async Task<PluginCommandDTO> GetCommandById(int commandId)
        {
            var plugin = await base.GetAsync(commandId);
            if (plugin == null)
            {
                throw new NotFoundException(nameof(Group), commandId);
            }
            return await base.GetAsync(commandId);
        }

        public async Task<PluginCommandDTO> Create(NewPluginCommandDTO command)
        {
            if (command == null)
            {
                throw new ArgumentException("Plugin is null");
            }
            return await base.AddAsync(command);
        }

        public async Task Update(PluginCommandDTO plugin)
        {
            if (plugin == null)
            {
                throw new ArgumentNullException();
            }
            await base.UpdateAsync(plugin);
        }

        public async Task Delete(int id)
        {
            var plugin = await base.GetAsync(id);
            if (plugin == null)
            {
                throw new NotFoundException(nameof(BuildPlugin), id);
            }
            await base.RemoveAsync(id);
        }
    }
}
