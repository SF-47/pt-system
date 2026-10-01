import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../models/meal_plan.dart';
import '../models/paginated_response.dart';

class MealService {
  final ApiClient _apiClient;

  MealService({
    ApiClient? apiClient,
  }) : _apiClient = apiClient ?? ApiClient();

  Future<PaginatedResponse<MealPlan>> getMealPlans({
    int page = 1,
    int pageSize = 10,
  }) async {
    final response = await _apiClient.dio.get(
      ApiConstants.clientMeals,
      queryParameters: {
        'page': page,
        'pageSize': pageSize,
      },
    );

    final data = response.data as Map<String, dynamic>;

    final List items = data['items'] ?? [];

    return PaginatedResponse<MealPlan>(
      items: items
          .map((mealPlan) => MealPlan.fromJson(mealPlan))
          .toList(),
      page: data['page'] ?? page,
      pageSize: data['pageSize'] ?? pageSize,
      totalCount: data['totalCount'] ?? 0,
      totalPages: data['totalPages'] ?? 0,
    );
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