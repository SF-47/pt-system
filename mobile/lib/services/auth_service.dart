import 'package:dio/dio.dart';

import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import 'token_storage.dart';

class AuthService {
  final ApiClient _apiClient;
  final TokenStorage _tokenStorage;

  AuthService({
    ApiClient? apiClient,
    TokenStorage? tokenStorage,
  })  : _apiClient = apiClient ?? ApiClient(),
        _tokenStorage = tokenStorage ?? TokenStorage();

  Future<void> login({
    required String username,
    required String password,
  }) async {
    try {
      final response = await _apiClient.dio.post(
        ApiConstants.clientLogin,
        data: {
          'username': username,
          'password': password,
        },
      );

      final token = response.data['token'];

      if (token == null || token.toString().isEmpty) {
        throw Exception('Login succeeded but no token was returned.');
      }

      await _tokenStorage.saveToken(token.toString());
    } on DioException catch (e) {
      if (e.response != null) {
        throw Exception(
          'Login failed: ${e.response?.data}',
        );
      }

      throw Exception(
        'Could not connect to the server: ${e.message}',
      );
    }


  }
}