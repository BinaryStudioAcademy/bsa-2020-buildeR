using System.Collections.Generic;
using System.Threading.Tasks;
using buildeR.Common.DTO;
using buildeR.Common.DTO.User;
using Microsoft.AspNetCore.Http;
using buildeR.DAL.Entities;

namespace buildeR.BLL.Interfaces
{
    public interface IUserService
    {
        public Task<UserDTO> GetUserById(int id);
        public Task<UserDTO> Login(string UId);
        Task<ICollection<UserDTO>> GetAll();
        Task<UserDTO> Register(NewUserDTO creatingUser);
        Task<UserDTO> Update(UserDTO userDTO);
        Task<bool> ValidateUsername(ValidateUserDTO user);
        Task<UserDTO> LinkProvider(LinkProviderDTO userLink);
        Task Delete(int id);
        Task AddUserLetter(UserLetterDTO newUserLetter);
    }
}