class Meal {
  final int mealStatusId;
  final int mealId;
  final String name;
  final String instructions;
  final int status;
  final DateTime? completedAt;

  Meal({
    required this.mealStatusId,
    required this.mealId,
    required this.name,
    required this.instructions,
    required this.status,
    required this.completedAt,
  });

  factory Meal.fromJson(Map<String, dynamic> json) {
    return Meal(
      mealStatusId: json['mealStatusId'] ?? 0,
      mealId: json['mealId'] ?? 0,
      name: json['name'] ?? '',
      instructions: json['instructions'] ?? '',
      status: json['status'] ?? 0,
      completedAt: json['completedAt'] != null
          ? DateTime.parse(json['completedAt'])
          : null,
    );
  }

  bool get isCompleted => status == 1;
  bool get isPending => status == 0;
  bool get isSkipped => status == 2;
}