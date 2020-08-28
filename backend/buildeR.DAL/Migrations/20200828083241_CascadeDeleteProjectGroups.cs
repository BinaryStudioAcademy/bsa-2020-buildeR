using Microsoft.EntityFrameworkCore.Migrations;

namespace buildeR.DAL.Migrations
{
    public partial class CascadeDeleteProjectGroups : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectGroups_Groups_GroupId",
                table: "ProjectGroups");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectGroups_Groups_GroupId",
                table: "ProjectGroups",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectGroups_Groups_GroupId",
                table: "ProjectGroups");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectGroups_Groups_GroupId",
                table: "ProjectGroups",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id");
        }
    }
}
