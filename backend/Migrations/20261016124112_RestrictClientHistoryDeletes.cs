using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RestrictClientHistoryDeletes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClientMealPlans_Clients_ClientId",
                table: "ClientMealPlans");

            migrationBuilder.DropForeignKey(
                name: "FK_ClientWorkoutAssignments_Clients_ClientId",
                table: "ClientWorkoutAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Clients_ClientId",
                table: "Payments");

            migrationBuilder.AddForeignKey(
                name: "FK_ClientMealPlans_Clients_ClientId",
                table: "ClientMealPlans",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ClientWorkoutAssignments_Clients_ClientId",
                table: "ClientWorkoutAssignments",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Clients_ClientId",
                table: "Payments",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClientMealPlans_Clients_ClientId",
                table: "ClientMealPlans");

            migrationBuilder.DropForeignKey(
                name: "FK_ClientWorkoutAssignments_Clients_ClientId",
                table: "ClientWorkoutAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Clients_ClientId",
                table: "Payments");

            migrationBuilder.AddForeignKey(
                name: "FK_ClientMealPlans_Clients_ClientId",
                table: "ClientMealPlans",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ClientWorkoutAssignments_Clients_ClientId",
                table: "ClientWorkoutAssignments",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Clients_ClientId",
                table: "Payments",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
