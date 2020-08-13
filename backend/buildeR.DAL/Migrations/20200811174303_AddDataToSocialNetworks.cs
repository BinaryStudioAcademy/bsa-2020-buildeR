using Microsoft.EntityFrameworkCore.Migrations;

namespace buildeR.DAL.Migrations
{
    public partial class AddDataToSocialNetworks : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "SocialNetworks",
                columns: new[] { "Id", "ProviderName" },
                values: new object[] { 1, 0 });

            migrationBuilder.InsertData(
                table: "SocialNetworks",
                columns: new[] { "Id", "ProviderName" },
                values: new object[] { 2, 1 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "SocialNetworks",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "SocialNetworks",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
