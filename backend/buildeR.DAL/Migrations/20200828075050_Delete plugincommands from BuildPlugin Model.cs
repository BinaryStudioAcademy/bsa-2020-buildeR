using Microsoft.EntityFrameworkCore.Migrations;

namespace buildeR.DAL.Migrations
{
    public partial class DeleteplugincommandsfromBuildPluginModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PluginCommands_BuildPlugins_PluginId",
                table: "PluginCommands");

            migrationBuilder.AddForeignKey(
                name: "FK_PluginCommands_BuildPlugins_PluginId",
                table: "PluginCommands",
                column: "PluginId",
                principalTable: "BuildPlugins",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PluginCommands_BuildPlugins_PluginId",
                table: "PluginCommands");

            migrationBuilder.AddForeignKey(
                name: "FK_PluginCommands_BuildPlugins_PluginId",
                table: "PluginCommands",
                column: "PluginId",
                principalTable: "BuildPlugins",
                principalColumn: "Id");
        }
    }
}
