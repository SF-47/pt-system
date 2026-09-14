import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../models/meal_plan.dart';

class MealService {
  final ApiClient _apiClient;

  MealService({
    ApiClient? apiClient,
  }) : _apiClient = apiClient ?? ApiClient();

  Future<List<MealPlan>> getMealPlans() async {
    final response = await _apiClient.dio.get(
      ApiConstants.clientMeals,
    );

    final List data = response.data;

    return data
        .map((mealPlan) => MealPlan.fromJson(mealPlan))
        .toList();
  }

  Future<void> updateMealStatus({
    required int mealStatusId,
    required int status,
  }) async {
    await _apiClient.dio.patch(
      '${ApiConstants.clientMeals}/$mealStatusId/status',
      data: {
        'status': status,
      },
    );
  }
}