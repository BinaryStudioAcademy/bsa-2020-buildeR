using Microsoft.EntityFrameworkCore;

namespace buildeR.DAL.Context
{
    public class QuartzDBContext : DbContext
    {
        public QuartzDBContext(DbContextOptions<QuartzDBContext> options) : base(options)
        {
        }
    }
}
