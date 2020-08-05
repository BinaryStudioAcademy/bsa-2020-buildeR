using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace buildeR.DAL.Context
{
    public class BuilderContext : DbContext
    {
        public DbSet<User> Users { get; private set; }
        
        public BuilderContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Configure();
            modelBuilder.Seed();
        }
    }
}