using buildeR.DAL.Context.EntityConfigurations;
using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace buildeR.DAL.Context
{
    public static class ModelBuilderExtensions
    {
        public static void Configure(this ModelBuilder modelBuilder)
        {
            // apply configurations from EntityConfigurations folder
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(UserConfig).Assembly);
        }
        
        public static void Seed(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(new User
            {
                Id = 1,
                FirstName = "Sasha",
                LastName = "Pastukh",
                Email = "random-email@gmail.com"
            });
        }
    }
}
