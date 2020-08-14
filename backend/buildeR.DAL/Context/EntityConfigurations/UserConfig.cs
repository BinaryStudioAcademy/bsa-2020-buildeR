using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.DAL.Context.EntityConfigurations
{
    public class UserConfig : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> entity)
        {
            entity.HasIndex(e => e.Username)
                .IsUnique();
            //entity.HasMany(e => e.BuildHistories)
            //    .WithOne(bh => bh.Performer)
            //    .HasForeignKey(bh => bh.PerformerId)
            //    .OnDelete(DeleteBehavior.NoAction);

            //entity.HasMany(e => e.Projects)
            //    .WithOne(p => p.Owner)
            //    .HasForeignKey(p => p.OwnerId)
            //    .OnDelete(DeleteBehavior.NoAction);

            //entity.HasMany(e => e.TeamMembers)
            //    .WithOne(tm => tm.User)
            //    .HasForeignKey(tm => tm.UserId)
            //    .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
