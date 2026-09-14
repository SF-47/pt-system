import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../models/workout.dart';

class WorkoutService {
  final ApiClient _apiClient;

  WorkoutService({
    ApiClient? apiClient,
  }) : _apiClient = apiClient ?? ApiClient();

  Future<List<Workout>> getWorkouts() async {
    final response = await _apiClient.dio.get(
      ApiConstants.clientWorkouts,
    );

    final List data = response.data;

    return data
        .map((workout) => Workout.fromJson(workout))
        .toList();
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