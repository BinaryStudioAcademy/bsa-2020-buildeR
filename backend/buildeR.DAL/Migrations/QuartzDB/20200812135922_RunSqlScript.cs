using Microsoft.EntityFrameworkCore.Migrations;
using System.IO;

namespace buildeR.DAL.Migrations.QuartzDB
{
    public partial class RunSqlScript : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sqlFile = "../buildeR.DAL/QuartzSqlScript.sql";
            migrationBuilder.Sql(File.ReadAllText(sqlFile));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
