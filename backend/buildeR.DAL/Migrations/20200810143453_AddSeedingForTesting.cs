using Microsoft.EntityFrameworkCore.Migrations;

namespace buildeR.DAL.Migrations
{
    public partial class AddSeedingForTesting : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AvatarUrl", "Bio", "Email", "FirstName", "LastName", "Role", "Username" },
                values: new object[] { 1, null, "", "buildeR@gmail.com", "Build", "R", 1, "buildeR" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
