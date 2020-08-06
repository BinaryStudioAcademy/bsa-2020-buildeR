using System.Threading.Tasks;
using buildeR.DAL.Entities;

namespace buildeR.BLL.Interfaces
{
    public interface IUserService
    {
        public Task<User> GetUserById(int id);
    }
}