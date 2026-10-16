using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RestrictMealHistoryDeletes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClientMealStatuses_Meals_MealId",
                table: "ClientMealStatuses");

            migrationBuilder.AddForeignKey(
                name: "FK_ClientMealStatuses_Meals_MealId",
                table: "ClientMealStatuses",
                column: "MealId",
                principalTable: "Meals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClientMealStatuses_Meals_MealId",
                table: "ClientMealStatuses");

            migrationBuilder.AddForeignKey(
                name: "FK_ClientMealStatuses_Meals_MealId",
                table: "ClientMealStatuses",
                column: "MealId",
                principalTable: "Meals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
