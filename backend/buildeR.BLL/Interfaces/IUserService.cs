using System.Collections.Generic;
using System.Threading.Tasks;
using buildeR.Common.DTO.User;

namespace buildeR.BLL.Interfaces
{
    public interface IUserService
    {
        public Task<UserDTO> GetUserById(int id);
        public Task<UserDTO> GetUserByUId(string UId);
        Task<ICollection<UserDTO>> GetAll();
        Task<UserDTO> Create(NewUserDTO creatingUser);
        Task<UserDTO> Update(UserDTO userDTO);
        Task Delete(int id);
        Task RefreshSocialNetworkToken(int userId, string token);
    }
}