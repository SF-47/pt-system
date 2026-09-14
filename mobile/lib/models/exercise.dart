class Exercise {
  final int id;
  final String name;
  final String description;
  final int sets;
  final int reps;
  final int restSeconds;

  Exercise({
    required this.id,
    required this.name,
    required this.description,
    required this.sets,
    required this.reps,
    required this.restSeconds,
  });

  factory Exercise.fromJson(Map<String, dynamic> json) {
    return Exercise(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      sets: json['sets'] ?? 0,
      reps: json['reps'] ?? 0,
      restSeconds: json['restSeconds'] ?? 0,
    );
  }
}