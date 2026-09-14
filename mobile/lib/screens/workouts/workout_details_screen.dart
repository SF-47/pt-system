import 'package:flutter/material.dart';

import '../../models/workout.dart';
import '../../services/workout_service.dart';

class WorkoutDetailsScreen extends StatefulWidget {
  final int assignmentId;

  const WorkoutDetailsScreen({
    super.key,
    required this.assignmentId,
  });

  @override
  State<WorkoutDetailsScreen> createState() => _WorkoutDetailsScreenState();
}

class _WorkoutDetailsScreenState extends State<WorkoutDetailsScreen> {
  final WorkoutService _workoutService = WorkoutService();

  Workout? _workout;
  bool _isLoading = true;
  bool _isUpdating = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadWorkout();
  }

  Future<void> _loadWorkout() async {
    try {
      final workout = await _workoutService.getWorkoutDetails(
        widget.assignmentId,
      );

      if (!mounted) return;

      setState(() {
        _workout = workout;
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _markAsCompleted() async {
    if (_workout == null || _isUpdating) return;

    setState(() {
      _isUpdating = true;
    });

    try {
      await _workoutService.updateWorkoutStatus(
        assignmentId: _workout!.assignmentId,
        status: 1,
      );

      if (!mounted) return;

      setState(() {
        _workout = Workout(
          assignmentId: _workout!.assignmentId,
          workoutPlanId: _workout!.workoutPlanId,
          name: _workout!.name,
          description: _workout!.description,
          assignedDate: _workout!.assignedDate,
          status: 1,
          completedAt: DateTime.now(),
          exercises: _workout!.exercises,
        );
        _isUpdating = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Workout marked as completed!'),
        ),
      );
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _isUpdating = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            e.toString().replaceFirst('Exception: ', ''),
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6F8F6),
      appBar: AppBar(
        title: const Text('Workout Details'),
        backgroundColor: const Color(0xFF2F855A),
        foregroundColor: Colors.white,
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(
          color: Color(0xFF2F855A),
        ),
      );
    }

    if (_errorMessage != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Text(
            _errorMessage!,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: Color(0xFFDC2626),
            ),
          ),
        ),
      );
    }

    if (_workout == null) {
      return const Center(
        child: Text('Workout not found.'),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            _workout!.name,
            style: const TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1F2937),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            _workout!.description,
            style: const TextStyle(
              fontSize: 15,
              color: Color(0xFF6B7280),
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Exercises',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1F2937),
            ),
          ),
          const SizedBox(height: 12),
          ..._workout!.exercises.asMap().entries.map(
                (entry) => _ExerciseCard(
              number: entry.key + 1,
              exercise: entry.value,
            ),
          ),
          const SizedBox(height: 20),
          if (_workout!.isCompleted)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFEAF6EF),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.check_circle,
                    color: Color(0xFF2F855A),
                  ),
                  SizedBox(width: 8),
                  Text(
                    'Workout Completed',
                    style: TextStyle(
                      color: Color(0xFF2F855A),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            )
          else
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton.icon(
                onPressed: _isUpdating ? null : _markAsCompleted,
                icon: _isUpdating
                    ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: Colors.white,
                  ),
                )
                    : const Icon(Icons.check),
                label: Text(
                  _isUpdating
                      ? 'Updating...'
                      : 'Mark as Completed',
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2F855A),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _ExerciseCard extends StatelessWidget {
  final int number;
  final dynamic exercise;

  const _ExerciseCard({
    required this.number,
    required this.exercise,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      color: Colors.white,
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 18,
                  backgroundColor: const Color(0xFFEAF6EF),
                  child: Text(
                    '$number',
                    style: const TextStyle(
                      color: Color(0xFF2F855A),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    exercise.name,
                    style: const TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1F2937),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              exercise.description,
              style: const TextStyle(
                fontSize: 14,
                color: Color(0xFF6B7280),
              ),
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                _ExerciseInfo(
                  label: 'Sets',
                  value: '${exercise.sets}',
                ),
                _ExerciseInfo(
                  label: 'Reps',
                  value: '${exercise.reps}',
                ),
                _ExerciseInfo(
                  label: 'Rest',
                  value: '${exercise.restSeconds}s',
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _ExerciseInfo extends StatelessWidget {
  final String label;
  final String value;

  const _ExerciseInfo({
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        children: [
          Text(
            value,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Color(0xFF2F855A),
            ),
          ),
          const SizedBox(height: 3),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              color: Color(0xFF6B7280),
            ),
          ),
        ],
      ),
    );
  }
}