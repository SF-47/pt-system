import 'dart:async';

import 'package:flutter/material.dart';
import '../../models/workout.dart';
import '../../services/workout_service.dart';
import 'package:vibration/vibration.dart';

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

    final shouldComplete = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Complete Workout?'),
          content: const Text(
            'Are you sure you want to mark this workout as completed?',
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context, false);
              },
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context, true);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF2F855A),
                foregroundColor: Colors.white,
              ),
              child: const Text('Complete'),
            ),
          ],
        );
      },
    );

    if (shouldComplete != true) return;

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

class _ExerciseCard extends StatefulWidget {
  final int number;
  final dynamic exercise;

  const _ExerciseCard({
    required this.number,
    required this.exercise,
  });

  @override
  State<_ExerciseCard> createState() => _ExerciseCardState();
}

class _ExerciseCardState extends State<_ExerciseCard> {
  int _completedSets = 0;

  Timer? _timer;
  int _remainingSeconds = 0;
  bool _isResting = false;
  bool _isPaused = false;

  void _startRestTimer() {
    final restSeconds = widget.exercise.restSeconds;

    if (restSeconds <= 0) {
      return;
    }

    _timer?.cancel();

    setState(() {
      _remainingSeconds = restSeconds;
      _isResting = true;
      _isPaused = false;
    });

    _timer = Timer.periodic(
      const Duration(seconds: 1),
          (timer) {
        if (!mounted) {
          timer.cancel();
          return;
        }

        if (_isPaused) {
          return;
        }

        if (_remainingSeconds > 1) {
          setState(() {
            _remainingSeconds--;
          });
        } else {
          timer.cancel();

          // Immediately finish the timer.
          setState(() {
            _remainingSeconds = 0;
            _isResting = false;
            _isPaused = false;
          });

          // Vibrate after the timer has finished.
          Vibration.vibrate(duration: 500);

          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Rest complete! Ready for your next set.'),
              duration: Duration(seconds: 2),
            ),
          );
        }
      },
    );
  }

  void _togglePause() {
    setState(() {
      _isPaused = !_isPaused;
    });
  }

  void _skipRest() {
    _timer?.cancel();

    setState(() {
      _remainingSeconds = 0;
      _isResting = false;
      _isPaused = false;
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
  @override
  Widget build(BuildContext context) {
    final exercise = widget.exercise;
    final totalSets = exercise.sets;

    final isCompleted = _completedSets >= totalSets;

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
                    '${widget.number}',
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
                if (isCompleted)
                  const Icon(
                    Icons.check_circle,
                    color: Color(0xFF2F855A),
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

            const SizedBox(height: 18),

            // Set progress
    const SizedBox(height: 18),

    if (_isResting) ...[
    Container(
    width: double.infinity,
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
    color: const Color(0xFFEAF6EF),
    borderRadius: BorderRadius.circular(12),
    ),
    child: Column(
    children: [
    const Text(
    'Rest Time',
    style: TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    color: Color(0xFF6B7280),
    ),
    ),
    const SizedBox(height: 6),
      SizedBox(
        width: 100,
        height: 100,
        child: Stack(
          alignment: Alignment.center,
          children: [
            SizedBox(
              width: 190,
              height: 190,
              child: CircularProgressIndicator(
                value: widget.exercise.restSeconds == 0
                    ? 0
                    : _remainingSeconds / widget.exercise.restSeconds,
                strokeWidth: 10,
                backgroundColor: const Color(0xFFD5EBDD),
                color: const Color(0xFF2F855A),
              ),
            ),
            Text(
              '${_remainingSeconds}s',
              style: const TextStyle(
                fontSize: 38,
                fontWeight: FontWeight.bold,
                color: Color(0xFF2F855A),
              ),
            ),
          ],
        ),
      ),
    const SizedBox(height: 12),
    Row(
    children: [
    Expanded(
    child: OutlinedButton.icon(
    onPressed: _togglePause,
    icon: Icon(
    _isPaused ? Icons.play_arrow : Icons.pause,
    ),
    label: Text(
    _isPaused ? 'Resume' : 'Pause',
    ),
    ),
    ),
    const SizedBox(width: 10),
    Expanded(
    child: OutlinedButton.icon(
    onPressed: _skipRest,
    icon: const Icon(Icons.skip_next),
    label: const Text('Skip Rest'),
    ),
    ),
    ],
    ),
    ],
    ),
    ),
    const SizedBox(height: 14),
    ],

    Text(
    isCompleted
    ? 'Exercise completed'
        : 'Set $_completedSets of $totalSets completed',
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: Color(0xFF6B7280),
              ),
            ),

            const SizedBox(height: 8),

            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: LinearProgressIndicator(
                value: totalSets == 0
                    ? 0
                    : _completedSets / totalSets,
                minHeight: 8,
                backgroundColor: const Color(0xFFEAF6EF),
                color: const Color(0xFF2F855A),
              ),
            ),

            const SizedBox(height: 14),

            SizedBox(
              width: double.infinity,
              height: 44,
              child: ElevatedButton.icon(
                onPressed: isCompleted || _isResting
                    ? null
                    : () {
                  setState(() {
                    _completedSets++;
                  });

                  if (_completedSets < totalSets) {
                    _startRestTimer();
                  }
                },
                icon: Icon(
                  isCompleted
                      ? Icons.check
                      : Icons.check_circle_outline,
                ),
                label: Text(
                  isCompleted
                      ? 'Exercise Completed'
                      : 'Complete Set',
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2F855A),
                  foregroundColor: Colors.white,
                  disabledBackgroundColor: const Color(0xFFEAF6EF),
                  disabledForegroundColor: const Color(0xFF2F855A),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
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