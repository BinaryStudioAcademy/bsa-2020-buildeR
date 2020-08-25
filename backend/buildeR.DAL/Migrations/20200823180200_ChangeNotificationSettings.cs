using Microsoft.EntityFrameworkCore.Migrations;

namespace buildeR.DAL.Migrations
{
    public partial class ChangeNotificationSettings : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_NotificationSettings_UserId",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "App",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "NotificationType",
                table: "NotificationSettings");

            migrationBuilder.AddColumn<bool>(
                name: "EnableApp",
                table: "NotificationSettings",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "EnableEmail",
                table: "NotificationSettings",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "NotificationSettingOptions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NotificationSettingId = table.Column<int>(nullable: false),
                    NotificationType = table.Column<int>(nullable: false),
                    App = table.Column<bool>(nullable: false),
                    Email = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationSettingOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NotificationSettingOptions_NotificationSettings_NotificationSettingId",
                        column: x => x.NotificationSettingId,
                        principalTable: "NotificationSettings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NotificationSettings_UserId",
                table: "NotificationSettings",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NotificationSettingOptions_NotificationSettingId",
                table: "NotificationSettingOptions",
                column: "NotificationSettingId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NotificationSettingOptions");

            migrationBuilder.DropIndex(
                name: "IX_NotificationSettings_UserId",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "EnableApp",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "EnableEmail",
                table: "NotificationSettings");

            migrationBuilder.AddColumn<bool>(
                name: "App",
                table: "NotificationSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Email",
                table: "NotificationSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "NotificationType",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_NotificationSettings_UserId",
                table: "NotificationSettings",
                column: "UserId");
        }
    }
}
