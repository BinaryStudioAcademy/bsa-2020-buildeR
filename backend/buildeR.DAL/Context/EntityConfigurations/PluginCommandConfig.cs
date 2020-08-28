using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace buildeR.DAL.Context.EntityConfigurations
{
    public class PluginCommandConfig : IEntityTypeConfiguration<PluginCommand>
    {
        public void Configure(EntityTypeBuilder<PluginCommand> entity)
        {
        }
    }
}
