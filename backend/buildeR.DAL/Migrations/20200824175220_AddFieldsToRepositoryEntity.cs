using Microsoft.EntityFrameworkCore.Migrations;

namespace buildeR.DAL.Migrations
{
    public partial class AddFieldsToRepositoryEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Privte",
                table: "Repositories");

            migrationBuilder.AddColumn<bool>(
                name: "CreatedByLink",
                table: "Repositories",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Owner",
                table: "Repositories",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Private",
                table: "Repositories",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByLink",
                table: "Repositories");

            migrationBuilder.DropColumn(
                name: "Owner",
                table: "Repositories");

            migrationBuilder.DropColumn(
                name: "Private",
                table: "Repositories");

            migrationBuilder.AddColumn<bool>(
                name: "Privte",
                table: "Repositories",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
