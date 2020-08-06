using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace buildeR.DAL.Context.EntityConfigurations
{
    public class ProjectConfig : IEntityTypeConfiguration<Project>
    {
        public void Configure(EntityTypeBuilder<Project> entity)
        {
            entity.HasOne(e => e.Owner)
                .WithMany(o => o.Projects)
                .OnDelete(DeleteBehavior.NoAction);

            //entity.HasMany(e => e.BuildHistories)
            //    .WithOne(bh => bh.Project)
            //    .HasForeignKey(bh => bh.ProjectId)
            //    .OnDelete(DeleteBehavior.NoAction);

            //entity.HasMany(e => e.BuildSteps)
            //    .WithOne(bs => bs.Project)
            //    .HasForeignKey(bs => bs.ProjectId)
            //    .OnDelete(DeleteBehavior.NoAction);

            //entity.HasMany(e => e.ProjectGroups)
            //    .WithOne(pg => pg.Project)
            //    .HasForeignKey(pg => pg.ProjectId)
            //    .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
