using Microsoft.EntityFrameworkCore.Migrations;

namespace buildeR.DAL.Migrations
{
    public partial class DeleteSocialNetwork : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserSocialNetworks_SocialNetworks_SocialNetworkId",
                table: "UserSocialNetworks");

            migrationBuilder.DropTable(
                name: "SocialNetworks");

            migrationBuilder.DropIndex(
                name: "IX_UserSocialNetworks_SocialNetworkId",
                table: "UserSocialNetworks");

            migrationBuilder.DropColumn(
                name: "SocialNetworkId",
                table: "UserSocialNetworks");

            migrationBuilder.AddColumn<int>(
                name: "ProviderName",
                table: "UserSocialNetworks",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProviderName",
                table: "UserSocialNetworks");

            migrationBuilder.AddColumn<int>(
                name: "SocialNetworkId",
                table: "UserSocialNetworks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "SocialNetworks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProviderName = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SocialNetworks", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "SocialNetworks",
                columns: new[] { "Id", "ProviderName" },
                values: new object[] { 1, 0 });

            migrationBuilder.InsertData(
                table: "SocialNetworks",
                columns: new[] { "Id", "ProviderName" },
                values: new object[] { 2, 1 });

            migrationBuilder.CreateIndex(
                name: "IX_UserSocialNetworks_SocialNetworkId",
                table: "UserSocialNetworks",
                column: "SocialNetworkId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserSocialNetworks_SocialNetworks_SocialNetworkId",
                table: "UserSocialNetworks",
                column: "SocialNetworkId",
                principalTable: "SocialNetworks",
                principalColumn: "Id");
        }
    }
}
