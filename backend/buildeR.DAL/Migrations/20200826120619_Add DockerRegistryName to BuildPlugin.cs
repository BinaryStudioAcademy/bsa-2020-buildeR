using Microsoft.EntityFrameworkCore.Migrations;

namespace buildeR.DAL.Migrations
{
    public partial class AddDockerRegistryNametoBuildPlugin : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DockerRegistryName",
                table: "BuildPlugins",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "BuildPlugins",
                keyColumn: "Id",
                keyValue: 1,
                column: "DockerRegistryName",
                value: "microsoft%2Fdotnet");

            migrationBuilder.UpdateData(
                table: "BuildPlugins",
                keyColumn: "Id",
                keyValue: 2,
                column: "DockerRegistryName",
                value: "node");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DockerRegistryName",
                table: "BuildPlugins");
        }
    }
}
