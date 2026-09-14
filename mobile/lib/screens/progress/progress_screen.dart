import 'package:flutter/material.dart';

import '../../models/progress.dart';
import '../../services/progress_service.dart';

class ProgressScreen extends StatefulWidget {
  const ProgressScreen({super.key});

  @override
  State<ProgressScreen> createState() => _ProgressScreenState();
}

class _ProgressScreenState extends State<ProgressScreen> {
  final ProgressService _progressService = ProgressService();

  Progress? _progress;
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadProgress();
  }

  Future<void> _loadProgress() async {
    try {
      final progress = await _progressService.getProgress();

      if (!mounted) return;

      setState(() {
        _progress = progress;
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6F8F6),
      appBar: AppBar(
        title: const Text('My Progress'),
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

    if (_progress == null) {
      return const Center(
        child: Text('No progress data available.'),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadProgress,
      color: const Color(0xFF2F855A),
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          const Text(
            'Your Progress',
            style: TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1F2937),
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Keep going and stay consistent with your plan.',
            style: TextStyle(
              fontSize: 14,
              color: Color(0xFF6B7280),
            ),
          ),
          const SizedBox(height: 24),

          _ProgressCard(
            title: 'Workouts',
            icon: Icons.fitness_center,
            total: _progress!.totalWorkouts,
            completed: _progress!.completedWorkouts,
            pending: _progress!.pendingWorkouts,
            skipped: _progress!.skippedWorkouts,
          ),

          const SizedBox(height: 16),

          _ProgressCard(
            title: 'Meals',
            icon: Icons.restaurant_menu,
            total: _progress!.totalMeals,
            completed: _progress!.completedMeals,
            pending: _progress!.pendingMeals,
            skipped: _progress!.skippedMeals,
          ),
        ],
      ),
    );
  }
}

class _ProgressCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final int total;
  final int completed;
  final int pending;
  final int skipped;

  const _ProgressCard({
    required this.title,
    required this.icon,
    required this.total,
    required this.completed,
    required this.pending,
    required this.skipped,
  });

  @override
  Widget build(BuildContext context) {
    final double percentage = total == 0 ? 0 : completed / total;

    return Card(
      color: Colors.white,
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEAF6EF),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    icon,
                    color: const Color(0xFF2F855A),
                  ),
                ),
                const SizedBox(width: 14),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1F2937),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 20),

            Text(
              '${(percentage * 100).round()}% completed',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Color(0xFF2F855A),
              ),
            ),

            const SizedBox(height: 10),

            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: LinearProgressIndicator(
                value: percentage,
                minHeight: 10,
                backgroundColor: const Color(0xFFE5E7EB),
                color: const Color(0xFF2F855A),
              ),
            ),

            const SizedBox(height: 20),

            Row(
              children: [
                Expanded(
                  child: _StatItem(
                    label: 'Total',
                    value: total,
                  ),
                ),
                Expanded(
                  child: _StatItem(
                    label: 'Completed',
                    value: completed,
                  ),
                ),
                Expanded(
                  child: _StatItem(
                    label: 'Pending',
                    value: pending,
                  ),
                ),
                Expanded(
                  child: _StatItem(
                    label: 'Skipped',
                    value: skipped,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String label;
  final int value;

  const _StatItem({
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          '$value',
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Color(0xFF1F2937),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          textAlign: TextAlign.center,
          style: const TextStyle(
            fontSize: 11,
            color: Color(0xFF6B7280),
          ),
        ),
      ],
    );
  }
}