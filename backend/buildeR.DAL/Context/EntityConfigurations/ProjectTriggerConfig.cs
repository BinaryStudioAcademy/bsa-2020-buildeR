using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.DAL.Context.EntityConfigurations
{
    public class ProjectTriggerConfig : IEntityTypeConfiguration<ProjectTrigger>
    {
        public void Configure(EntityTypeBuilder<ProjectTrigger> entity)
        {
            entity.HasOne(e => e.Project)
                .WithMany(g => g.ProjectTriggers)
                .HasForeignKey(e => e.ProjectId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
