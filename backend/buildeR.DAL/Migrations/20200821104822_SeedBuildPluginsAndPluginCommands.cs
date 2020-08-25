using Microsoft.EntityFrameworkCore.Migrations;

namespace buildeR.DAL.Migrations
{
    public partial class SeedBuildPluginsAndPluginCommands : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "BuildPlugins",
                columns: new[] { "Id", "Command", "DockerImageName", "PluginName" },
                values: new object[] { 1, "dotnet", "mcr.microsoft.com/dotnet/core/sdk", ".NET Core" });

            migrationBuilder.InsertData(
                table: "BuildPlugins",
                columns: new[] { "Id", "Command", "DockerImageName", "PluginName" },
                values: new object[] { 2, "npm", "node", "Node.js" });

            migrationBuilder.InsertData(
                table: "PluginCommands",
                columns: new[] { "Id", "Name", "PluginId", "TemplateForDocker" },
                values: new object[] { 2, "restore", 1, null });

            migrationBuilder.InsertData(
                table: "PluginCommands",
                columns: new[] { "Id", "Name", "PluginId", "TemplateForDocker" },
                values: new object[] { 1, "build", 1, null });

            migrationBuilder.InsertData(
                table: "PluginCommands",
                columns: new[] { "Id", "Name", "PluginId", "TemplateForDocker" },
                values: new object[] { 3, "install", 2, null });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "PluginCommands",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "PluginCommands",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "PluginCommands",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "BuildPlugins",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "BuildPlugins",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
