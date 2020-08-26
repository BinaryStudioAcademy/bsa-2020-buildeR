using Microsoft.EntityFrameworkCore.Migrations;

namespace buildeR.DAL.Migrations
{
    public partial class AddUsernameAndPasswordFieldsToRepository : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "Repositories",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "Repositories",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Password",
                table: "Repositories");

            migrationBuilder.DropColumn(
                name: "Username",
                table: "Repositories");
        }
    }
}
