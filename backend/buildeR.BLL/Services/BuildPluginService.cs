using AutoMapper;
using buildeR.BLL.Exceptions;
using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.BuildPlugin;
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
    public class BuildPluginService : BaseCrudService<BuildPlugin, BuildPluginDTO, NewBuildPluginDTO>, IBuildPluginService
    {
        private const string DockerHubRepositoriesUrl = "https://registry.hub.docker.com/v1/repositories";

        private readonly IHttpClient _httpClient;
        private readonly IMemoryCache _cache;
        private readonly BuilderContext _context;
        private readonly IMapper _mapper;

        public BuildPluginService(BuilderContext context, IMapper mapper, IHttpClient httpClient, IMemoryCache cache) : base(context, mapper)
        {
            _httpClient = httpClient;
            _cache = cache;
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<BuildPluginDTO>> GetAll()
        {
            var plugins = await Context
                .Set<BuildPlugin>()
                .Include(BuildPlugin => BuildPlugin.PluginCommands)
                .AsNoTracking()
                .ToListAsync();
            return Mapper.Map<IEnumerable<BuildPluginDTO>>(plugins);
        }

        public async Task<BuildPluginDTO> GetPluginById(int pluginId)
        {
            var plugin = await base.GetAsync(pluginId);
            if (plugin == null)
            {
                throw new NotFoundException(nameof(Group), pluginId);
            }
            return await base.GetAsync(pluginId);
        }

        public async Task<BuildPluginDTO> Create(NewBuildPluginDTO plugin)
        {
            if (plugin == null)
            {
                throw new ArgumentException("Plugin is null");
            }
            return await base.AddAsync(plugin);
        }

        public async Task Update(BuildPluginDTO plugin)
        {
            if (plugin == null)
            {
                throw new ArgumentNullException();
            }

            foreach (var commandDTO in plugin.PluginCommands)
            {
                var command = Mapper.Map<PluginCommand>(commandDTO);
                if (!base.Context.PluginCommands.Contains(command))
                    base.Context.PluginCommands.Add(command);
                else
                    base.Context.PluginCommands.Update(command);
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

            var pluginCommands = await Context
                .PluginCommands
                .AsNoTracking()
                .Where(pluginCommand => pluginCommand.Id.Equals(id))
                .ToListAsync();

            Context.PluginCommands.RemoveRange(pluginCommands);

            await base.RemoveAsync(id);
        }

        public async Task<IEnumerable<string>> GetVersionsOfBuildPlugin(string buildPluginName, string partOfVersionWord)
        {
            IEnumerable<PluginVersionDTO> result = null;
            if (!_cache.TryGetValue(buildPluginName, out result))
            {
                var response = await _httpClient
                    .SendRequestAsync(HttpMethod.Get, $"{DockerHubRepositoriesUrl}/{buildPluginName}/tags", null);
                result = await _httpClient.GetResponseResultOrDefaultAsync<IEnumerable<PluginVersionDTO>>(response);
                if (result != null)
                {
                    _cache.Set(buildPluginName, result,
                        new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromMinutes(60)));
                }
            }

            return result
                .Where(version => version.Name.Equals(partOfVersionWord, StringComparison.InvariantCultureIgnoreCase) || version.Name.StartsWith(partOfVersionWord, StringComparison.InvariantCultureIgnoreCase))
                .Take(10)
                .Select(version => version.Name);
        }
    }
}
