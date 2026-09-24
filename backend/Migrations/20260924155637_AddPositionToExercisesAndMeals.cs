using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddPositionToExercisesAndMeals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Position",
                table: "Meals",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Position",
                table: "Exercises",
                type: "int",
                nullable: false,
                defaultValue: 0);

            // Existing rows get Position 1..n inside their plan, following Id
            // order. This is only the fallback for data created before Position
            // existed. The derived table lets MySQL/MariaDB read the table being
            // updated.
            migrationBuilder.Sql(@"
                UPDATE `Exercises` AS e
                SET e.`Position` = (
                    SELECT COUNT(*)
                    FROM (SELECT `Id`, `WorkoutPlanId` FROM `Exercises`) AS x
                    WHERE x.`WorkoutPlanId` = e.`WorkoutPlanId` AND x.`Id` <= e.`Id`
                );");

            migrationBuilder.Sql(@"
                UPDATE `Meals` AS m
                SET m.`Position` = (
                    SELECT COUNT(*)
                    FROM (SELECT `Id`, `MealPlanId` FROM `Meals`) AS x
                    WHERE x.`MealPlanId` = m.`MealPlanId` AND x.`Id` <= m.`Id`
                );");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Position",
                table: "Meals");

            migrationBuilder.DropColumn(
                name: "Position",
                table: "Exercises");
        }
    }
}
