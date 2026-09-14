import 'package:flutter/material.dart';

import '../../models/meal_plan.dart';
import '../../services/meal_service.dart';

class MealsScreen extends StatefulWidget {
  const MealsScreen({super.key});

  @override
  State<MealsScreen> createState() => _MealsScreenState();
}

class _MealsScreenState extends State<MealsScreen> {
  final MealService _mealService = MealService();

  List<MealPlan> _mealPlans = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadMeals();
  }

  Future<void> _loadMeals() async {
    try {
      final mealPlans = await _mealService.getMealPlans();

      if (!mounted) return;

      setState(() {
        _mealPlans = mealPlans;
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
        title: const Text('My Meals'),
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

    if (_mealPlans.isEmpty) {
      return const Center(
        child: Text(
          'No meal plans assigned yet.',
          style: TextStyle(
            fontSize: 16,
            color: Color(0xFF6B7280),
          ),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadMeals,
      color: const Color(0xFF2F855A),
      child: ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: _mealPlans.length,
        itemBuilder: (context, index) {
          final mealPlan = _mealPlans[index];

          return _MealPlanCard(
            mealPlan: mealPlan,
          );
        },
      ),
    );
  }
}

class _MealPlanCard extends StatelessWidget {
  final MealPlan mealPlan;

  const _MealPlanCard({
    required this.mealPlan,
  });

  @override
  Widget build(BuildContext context) {
    final completedMeals =
        mealPlan.meals.where((meal) => meal.isCompleted).length;

    final totalMeals = mealPlan.meals.length;

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      color: Colors.white,
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
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
                  child: const Icon(
                    Icons.restaurant_menu,
                    color: Color(0xFF2F855A),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Text(
                    mealPlan.name,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1F2937),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Text(
              mealPlan.description,
              style: const TextStyle(
                fontSize: 14,
                color: Color(0xFF6B7280),
              ),
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                const Icon(
                  Icons.calendar_today_outlined,
                  size: 16,
                  color: Color(0xFF6B7280),
                ),
                const SizedBox(width: 6),
                Text(
                  'Assigned: ${_formatDate(mealPlan.assignedDate)}',
                  style: const TextStyle(
                    fontSize: 13,
                    color: Color(0xFF6B7280),
                  ),
                ),
                const Spacer(),
                Text(
                  '$completedMeals/$totalMeals completed',
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF2F855A),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),
            const Divider(),
            const SizedBox(height: 8),
            ...mealPlan.meals.map(
                  (meal) => _MealItem(
                    mealStatusId: meal.mealStatusId,
                    mealName: meal.name,
                    instructions: meal.instructions,
                    isCompleted: meal.isCompleted,
                  ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}

class _MealItem extends StatefulWidget {
  final int mealStatusId;
  final String mealName;
  final String instructions;
  final bool isCompleted;

  const _MealItem({
    required this.mealStatusId,
    required this.mealName,
    required this.instructions,
    required this.isCompleted,
  });

  @override
  State<_MealItem> createState() => _MealItemState();
}

class _MealItemState extends State<_MealItem> {
  final MealService _mealService = MealService();

  late bool _isCompleted;
  bool _isUpdating = false;

  @override
  void initState() {
    super.initState();
    _isCompleted = widget.isCompleted;
  }

  Future<void> _toggleCompleted() async {
    if (_isUpdating) return;

    final newStatus = _isCompleted ? 0 : 1;

    setState(() {
      _isUpdating = true;
    });

    try {
      await _mealService.updateMealStatus(
        mealStatusId: widget.mealStatusId,
        status: newStatus,
      );

      if (!mounted) return;

      setState(() {
        _isCompleted = !_isCompleted;
        _isUpdating = false;
      });
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
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      child: Material(
        color: _isCompleted
            ? const Color(0xFFEAF6EF)
            : const Color(0xFFF6F8F6),
        borderRadius: BorderRadius.circular(12),
        child: InkWell(
          onTap: _isUpdating ? null : _toggleCompleted,
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _isUpdating
                    ? const SizedBox(
                  width: 24,
                  height: 24,
                  child: Padding(
                    padding: EdgeInsets.all(2),
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Color(0xFF2F855A),
                    ),
                  ),
                )
                    : Icon(
                  _isCompleted
                      ? Icons.check_circle
                      : Icons.radio_button_unchecked,
                  color: _isCompleted
                      ? const Color(0xFF2F855A)
                      : const Color(0xFF6B7280),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.mealName,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: _isCompleted
                              ? const Color(0xFF2F855A)
                              : const Color(0xFF1F2937),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        widget.instructions,
                        style: const TextStyle(
                          fontSize: 13,
                          color: Color(0xFF6B7280),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}