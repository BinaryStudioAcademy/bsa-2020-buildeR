using Microsoft.EntityFrameworkCore.Migrations;

namespace buildeR.DAL.Migrations
{
    public partial class AddRepositoryEntity : Migration
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

            migrationBuilder.CreateTable(
                name: "Repositories",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: true),
                    Privte = table.Column<bool>(nullable: false),
                    Url = table.Column<string>(nullable: true),
                    ProjectId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Repositories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Repositories_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Repositories_ProjectId",
                table: "Repositories",
                column: "ProjectId",
                unique: true);

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

            migrationBuilder.DropTable(
                name: "Repositories");

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
