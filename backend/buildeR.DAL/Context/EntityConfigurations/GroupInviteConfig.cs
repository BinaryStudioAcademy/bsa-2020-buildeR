using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace buildeR.DAL.Context.EntityConfigurations
{
    public class GroupInviteConfig : IEntityTypeConfiguration<GroupInvite>
    {
        public void Configure(EntityTypeBuilder<GroupInvite> entity)
        {
            entity.HasOne(e => e.Group)
                .WithMany(p => p.GroupInvitations)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.FromUser)
               .WithMany(g => g.GroupInvitations)
               .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
