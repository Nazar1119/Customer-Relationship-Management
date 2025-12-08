using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace crm.Migrations
{
    /// <inheritdoc />
    public partial class ClientsAndDevices1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clients_Employees_AssignedEmployeeId",
                table: "Clients");

            migrationBuilder.AlterColumn<int>(
                name: "AssignedEmployeeId",
                table: "Clients",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_Employees_AssignedEmployeeId",
                table: "Clients",
                column: "AssignedEmployeeId",
                principalTable: "Employees",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clients_Employees_AssignedEmployeeId",
                table: "Clients");

            migrationBuilder.AlterColumn<int>(
                name: "AssignedEmployeeId",
                table: "Clients",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_Employees_AssignedEmployeeId",
                table: "Clients",
                column: "AssignedEmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
