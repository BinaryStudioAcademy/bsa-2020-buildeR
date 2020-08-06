using System.Linq;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace buildeR.BLL.Services
{
    public class UserService : IUserService
    {
        private readonly BuilderContext _context;

        public UserService(BuilderContext context)
        {
            _context = context;
        }

        // use dto
        public async Task<User> GetUserById(int id)
        {
            return await _context.Users.AsNoTracking().FirstAsync(u => u.Id == id);
        }
    }
}