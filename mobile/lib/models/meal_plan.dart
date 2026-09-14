import 'meal.dart';

class MealPlan {
  final int assignmentId;
  final int mealPlanId;
  final String name;
  final String description;
  final DateTime assignedDate;
  final List<Meal> meals;

  MealPlan({
    required this.assignmentId,
    required this.mealPlanId,
    required this.name,
    required this.description,
    required this.assignedDate,
    required this.meals,
  });

  factory MealPlan.fromJson(Map<String, dynamic> json) {
    return MealPlan(
      assignmentId: json['assignmentId'] ?? 0,
      mealPlanId: json['mealPlanId'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      assignedDate: json['assignedDate'] != null
          ? DateTime.parse(json['assignedDate'])
          : DateTime.now(),
      meals: json['meals'] != null
          ? (json['meals'] as List)
          .map((meal) => Meal.fromJson(meal))
          .toList()
          : [],
    );
  }
}