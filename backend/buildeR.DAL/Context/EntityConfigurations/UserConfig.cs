using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace buildeR.DAL.Context.EntityConfigurations
{
    public class UserConfig : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> entity)
        {
            //entity.Property(p => p.FirstName).IsRequired().HasMaxLength(20);
            //entity.Property(p => p.LastName).IsRequired().HasMaxLength(20);
            //entity.Property(p => p.Email).IsRequired().HasMaxLength(30);
            //entity.ToTable("User");
        }
    }
}