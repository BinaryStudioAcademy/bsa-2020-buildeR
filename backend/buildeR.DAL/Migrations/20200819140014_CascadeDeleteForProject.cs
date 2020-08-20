using Microsoft.EntityFrameworkCore.Migrations;

namespace buildeR.DAL.Migrations
{
    public partial class CascadeDeleteForProject : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BuildHistories_Projects_ProjectId",
                table: "BuildHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_BuildSteps_Projects_ProjectId",
                table: "BuildSteps");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectGroups_Projects_ProjectId",
                table: "ProjectGroups");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTriggers_Projects_ProjectId",
                table: "ProjectTriggers");

            migrationBuilder.AddForeignKey(
                name: "FK_BuildHistories_Projects_ProjectId",
                table: "BuildHistories",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_BuildSteps_Projects_ProjectId",
                table: "BuildSteps",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectGroups_Projects_ProjectId",
                table: "ProjectGroups",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTriggers_Projects_ProjectId",
                table: "ProjectTriggers",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BuildHistories_Projects_ProjectId",
                table: "BuildHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_BuildSteps_Projects_ProjectId",
                table: "BuildSteps");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectGroups_Projects_ProjectId",
                table: "ProjectGroups");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTriggers_Projects_ProjectId",
                table: "ProjectTriggers");

            migrationBuilder.AddForeignKey(
                name: "FK_BuildHistories_Projects_ProjectId",
                table: "BuildHistories",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_BuildSteps_Projects_ProjectId",
                table: "BuildSteps",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectGroups_Projects_ProjectId",
                table: "ProjectGroups",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTriggers_Projects_ProjectId",
                table: "ProjectTriggers",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id");
        }
    }
}
