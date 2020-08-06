using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.DAL.Context.EntityConfigurations
{
    public class UserSocialNetworkConfig : IEntityTypeConfiguration<UserSocialNetwork>
    {
        public void Configure(EntityTypeBuilder<UserSocialNetwork> entity)
        {
            entity.HasOne(e => e.SocialNetwork)
                .WithMany(sn => sn.UserSocialNetworks)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(e => e.User)
                .WithMany(sn => sn.UserSocialNetworks)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
