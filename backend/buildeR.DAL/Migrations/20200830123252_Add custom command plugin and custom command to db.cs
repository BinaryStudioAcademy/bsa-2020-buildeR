using Microsoft.EntityFrameworkCore.Migrations;

namespace buildeR.DAL.Migrations
{
    public partial class Addcustomcommandpluginandcustomcommandtodb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "BuildPlugins",
                columns: new[] { "Id", "Command", "DockerImageName", "DockerRegistryName", "PluginName" },
                values: new object[] { 3, "sh", null, null, "Custom command" });

            migrationBuilder.InsertData(
                table: "PluginCommands",
                columns: new[] { "Id", "Name", "PluginId", "TemplateForDocker" },
                values: new object[] { 4, null, 3, null });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "PluginCommands",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "BuildPlugins",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
