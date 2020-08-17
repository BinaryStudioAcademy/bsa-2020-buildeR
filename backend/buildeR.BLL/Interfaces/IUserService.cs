using System.Collections.Generic;
using System.Threading.Tasks;
using buildeR.Common.DTO.User;

namespace buildeR.BLL.Interfaces
{
    public interface IUserService
    {
        public Task<UserDTO> GetUserById(int id);
        public Task<UserDTO> Login(string UId);
        Task<ICollection<UserDTO>> GetAll();
        Task<UserDTO> Register(NewUserDTO creatingUser);
        Task<UserDTO> Update(UserDTO userDTO);
        Task<bool> ValidateUsername(string username);
        Task Delete(int id);
    }
}