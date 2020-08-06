using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Services.Abstract
{
    public interface ICrudService<TEntityDTO, TEntityCreateDTO, TKey> : IDisposable
        where TEntityDTO : class
        where TEntityCreateDTO : class
        where TKey : IEquatable<TKey>
    {
        Task<TEntityDTO> AddAsync(TEntityCreateDTO dto);
        Task UpdateAsync(TEntityDTO dto);
        Task RemoveAsync(TKey id);
        Task<TEntityDTO> GetAsync(TKey id, bool isNoTracking = false);
        Task<IEnumerable<TEntityDTO>> GetAllAsync();
        Task<bool> ExistAsync(TKey id);
    }
}
