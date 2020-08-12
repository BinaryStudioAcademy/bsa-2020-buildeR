using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.Group;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IGroupService : ICrudService<GroupDTO, NewGroupDTO, int>
    {
        Task<GroupDTO> GetGroupById(int id);
        Task<IEnumerable<GroupDTO>> GetAll();
        Task<GroupDTO> Create(NewGroupDTO group);
        Task Update(GroupDTO group);
        Task Delete(int id);
    }
}
