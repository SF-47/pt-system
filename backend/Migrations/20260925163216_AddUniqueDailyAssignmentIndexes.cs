using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueDailyAssignmentIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ClientWorkoutAssignments_ClientId_AssignedDate",
                table: "ClientWorkoutAssignments",
                columns: new[] { "ClientId", "AssignedDate" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClientMealPlans_ClientId_AssignedDate",
                table: "ClientMealPlans",
                columns: new[] { "ClientId", "AssignedDate" },
                unique: true);

            migrationBuilder.DropIndex(
                name: "IX_ClientWorkoutAssignments_ClientId",
                table: "ClientWorkoutAssignments");

            migrationBuilder.DropIndex(
                name: "IX_ClientMealPlans_ClientId",
                table: "ClientMealPlans");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ClientWorkoutAssignments_ClientId",
                table: "ClientWorkoutAssignments",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_ClientMealPlans_ClientId",
                table: "ClientMealPlans",
                column: "ClientId");

            migrationBuilder.DropIndex(
                name: "IX_ClientWorkoutAssignments_ClientId_AssignedDate",
                table: "ClientWorkoutAssignments");

            migrationBuilder.DropIndex(
                name: "IX_ClientMealPlans_ClientId_AssignedDate",
                table: "ClientMealPlans");
        }
    }
}
