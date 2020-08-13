using Microsoft.EntityFrameworkCore.Migrations;

namespace buildeR.DAL.Migrations
{
    public partial class AddPropsForWorkWithDocker : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TemplateForDocker",
                table: "PluginCommands",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WorkDirectory",
                table: "BuildSteps",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DockerImageName",
                table: "BuildPlugins",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TemplateForDocker",
                table: "PluginCommands");

            migrationBuilder.DropColumn(
                name: "WorkDirectory",
                table: "BuildSteps");

            migrationBuilder.DropColumn(
                name: "DockerImageName",
                table: "BuildPlugins");
        }
    }
}
