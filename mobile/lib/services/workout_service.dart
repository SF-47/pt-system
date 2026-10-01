import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../models/workout.dart';
import '../models/paginated_response.dart';

class WorkoutService {
  final ApiClient _apiClient;

  WorkoutService({
    ApiClient? apiClient,
  }) : _apiClient = apiClient ?? ApiClient();

  Future<PaginatedResponse<Workout>> getWorkouts({
    int page = 1,
    int pageSize = 10,
  }) async {
    final response = await _apiClient.dio.get(
      ApiConstants.clientWorkouts,
      queryParameters: {
        'page': page,
        'pageSize': pageSize,
      },
    );

    final data = response.data as Map<String, dynamic>;

    final List items = data['items'] ?? [];

    return PaginatedResponse<Workout>(
      items: items
          .map((workout) => Workout.fromJson(workout))
          .toList(),
      page: data['page'] ?? page,
      pageSize: data['pageSize'] ?? pageSize,
      totalCount: data['totalCount'] ?? 0,
      totalPages: data['totalPages'] ?? 0,
    );
  }

  Future<Workout> getWorkoutDetails(int assignmentId) async {
    final response = await _apiClient.dio.get(
      '${ApiConstants.clientWorkouts}/$assignmentId',
    );

    return Workout.fromJson(response.data);
  }

  Future<void> updateWorkoutStatus({
    required int assignmentId,
    required int status,
  }) async {
    await _apiClient.dio.patch(
      '${ApiConstants.clientWorkouts}/$assignmentId/status',
      data: {
        'status': status,
      },
    );
  }
}