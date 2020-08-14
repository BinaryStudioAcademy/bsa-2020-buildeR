using Microsoft.EntityFrameworkCore.Migrations;
using System.IO;
using System.Reflection;

namespace buildeR.DAL.Migrations.QuartzDB
{
    public partial class RunSqlScript : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var path = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), @"Scripts/QuartzSqlScript.sql");
            migrationBuilder.Sql(File.ReadAllText(path));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
