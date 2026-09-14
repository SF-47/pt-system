import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../models/progress.dart';

class ProgressService {
  final ApiClient _apiClient;

  ProgressService({
    ApiClient? apiClient,
  }) : _apiClient = apiClient ?? ApiClient();

  Future<Progress> getProgress() async {
    final response = await _apiClient.dio.get(ApiConstants.clientProgress);
    return Progress.fromJson(response.data);
  }
}