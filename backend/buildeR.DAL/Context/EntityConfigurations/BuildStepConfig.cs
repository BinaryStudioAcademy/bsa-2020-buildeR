using buildeR.DAL.Entities;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace buildeR.DAL.Context.EntityConfigurations
{
    public class BuildStepConfig : IEntityTypeConfiguration<BuildStep>
    {
        public void Configure(EntityTypeBuilder<BuildStep> entity)
        {
            entity.HasOne(e => e.Project)
                .WithMany(p => p.BuildSteps)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(e => e.PluginCommand)
                .WithMany(p => p.BuildSteps)
                .OnDelete(DeleteBehavior.NoAction);

            //entity.HasMany(e => e.BuildPluginParameters)
            //    .WithOne(bpp => bpp.BuildStep)
            //    .HasForeignKey(bpp => bpp.BuildStepId)
            //    .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
