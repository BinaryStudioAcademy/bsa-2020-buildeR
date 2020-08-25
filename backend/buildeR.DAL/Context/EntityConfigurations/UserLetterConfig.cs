using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace buildeR.DAL.Context.EntityConfigurations
{
    public class UserLetterConfig: IEntityTypeConfiguration<UserLetter>
    {
        public void Configure(EntityTypeBuilder<UserLetter> builder)
        {
            
        }
    }
}