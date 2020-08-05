using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace buildeR.DAL.Context.EntityConfigurations
{
    public class BuildHistoryConfig : IEntityTypeConfiguration<BuildHistory>
    {
        public void Configure(EntityTypeBuilder<BuildHistory> entity)
        {
            entity.HasOne(e => e.Performer)
                .WithMany(p => p.BuildHistories)
                .HasForeignKey(e => e.PerformerId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(e => e.Project)
                .WithMany(p => p.BuildHistories)
                .HasForeignKey(e => e.ProjectId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
