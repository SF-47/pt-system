import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../models/client.dart';

class ClientService {
  final ApiClient _apiClient;

  ClientService({
    ApiClient? apiClient,
  }) : _apiClient = apiClient ?? ApiClient();

  Future<Client> getProfile() async {
    final response = await _apiClient.dio.get(
      ApiConstants.clientProfile,
    );

    return Client.fromJson(response.data);
  }
}