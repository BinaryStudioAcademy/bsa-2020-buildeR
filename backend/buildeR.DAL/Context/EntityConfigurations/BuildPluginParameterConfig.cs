using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.DAL.Context.EntityConfigurations
{
    public class BuildPluginParameterConfig : IEntityTypeConfiguration<BuildPluginParameter>
    {
        public void Configure(EntityTypeBuilder<BuildPluginParameter> entity)
        {
            entity.HasOne(e => e.BuildStep)
                .WithMany(bs => bs.BuildPluginParameters)
                .HasForeignKey(e => e.BuildStepId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
