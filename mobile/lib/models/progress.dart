class Progress {
  final int totalWorkouts;
  final int completedWorkouts;
  final int pendingWorkouts;
  final int skippedWorkouts;

  final int totalMeals;
  final int completedMeals;
  final int pendingMeals;
  final int skippedMeals;

  Progress({
    required this.totalWorkouts,
    required this.completedWorkouts,
    required this.pendingWorkouts,
    required this.skippedWorkouts,
    required this.totalMeals,
    required this.completedMeals,
    required this.pendingMeals,
    required this.skippedMeals,
  });

  factory Progress.fromJson(Map<String, dynamic> json) {
    return Progress(
      totalWorkouts: json['totalWorkouts'] ?? 0,
      completedWorkouts: json['completedWorkouts'] ?? 0,
      pendingWorkouts: json['pendingWorkouts'] ?? 0,
      skippedWorkouts: json['skippedWorkouts'] ?? 0,
      totalMeals: json['totalMeals'] ?? 0,
      completedMeals: json['completedMeals'] ?? 0,
      pendingMeals: json['pendingMeals'] ?? 0,
      skippedMeals: json['skippedMeals'] ?? 0,
    );
  }
}