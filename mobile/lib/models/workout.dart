import 'exercise.dart';

class Workout {
  final int assignmentId;
  final int workoutPlanId;
  final String name;
  final String description;
  final DateTime assignedDate;
  final int status;
  final DateTime? completedAt;
  final List<Exercise> exercises;

  Workout({
    required this.assignmentId,
    required this.workoutPlanId,
    required this.name,
    required this.description,
    required this.assignedDate,
    required this.status,
    required this.completedAt,
    required this.exercises,
  });

  factory Workout.fromJson(Map<String, dynamic> json) {
    return Workout(
      assignmentId: json['assignmentId'] ?? 0,
      workoutPlanId: json['workoutPlanId'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      assignedDate: json['assignedDate'] != null
          ? DateTime.parse(json['assignedDate'])
          : DateTime.now(),
      status: json['status'] ?? 0,
      completedAt: json['completedAt'] != null
          ? DateTime.parse(json['completedAt'])
          : null,
      exercises: json['exercises'] != null
          ? (json['exercises'] as List)
          .map(
            (exercise) => Exercise.fromJson(exercise),
      )
          .toList()
          : [],
    );
  }

  bool get isCompleted => status == 1;

  bool get isPending => status == 0;

  bool get isSkipped => status == 2;
}