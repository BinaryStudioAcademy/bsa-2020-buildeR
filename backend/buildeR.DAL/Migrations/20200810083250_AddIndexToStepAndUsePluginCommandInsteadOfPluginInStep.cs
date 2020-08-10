using Microsoft.EntityFrameworkCore.Migrations;

namespace buildeR.DAL.Migrations
{
    public partial class AddIndexToStepAndUsePluginCommandInsteadOfPluginInStep : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BuildSteps_BuildPlugins_BuildPluginId",
                table: "BuildSteps");

            migrationBuilder.DropIndex(
                name: "IX_BuildSteps_BuildPluginId",
                table: "BuildSteps");

            migrationBuilder.DropColumn(
                name: "BuildPluginId",
                table: "BuildSteps");

            migrationBuilder.AddColumn<int>(
                name: "Index",
                table: "BuildSteps",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PluginCommandId",
                table: "BuildSteps",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_BuildSteps_PluginCommandId",
                table: "BuildSteps",
                column: "PluginCommandId");

            migrationBuilder.AddForeignKey(
                name: "FK_BuildSteps_PluginCommands_PluginCommandId",
                table: "BuildSteps",
                column: "PluginCommandId",
                principalTable: "PluginCommands",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BuildSteps_PluginCommands_PluginCommandId",
                table: "BuildSteps");

            migrationBuilder.DropIndex(
                name: "IX_BuildSteps_PluginCommandId",
                table: "BuildSteps");

            migrationBuilder.DropColumn(
                name: "Index",
                table: "BuildSteps");

            migrationBuilder.DropColumn(
                name: "PluginCommandId",
                table: "BuildSteps");

            migrationBuilder.AddColumn<int>(
                name: "BuildPluginId",
                table: "BuildSteps",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_BuildSteps_BuildPluginId",
                table: "BuildSteps",
                column: "BuildPluginId");

            migrationBuilder.AddForeignKey(
                name: "FK_BuildSteps_BuildPlugins_BuildPluginId",
                table: "BuildSteps",
                column: "BuildPluginId",
                principalTable: "BuildPlugins",
                principalColumn: "Id");
        }
    }
}
