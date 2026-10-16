import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'api_client.dart';

class AuthApi {
  AuthApi(this._client, {FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage();

  final ApiClient _client;
  final FlutterSecureStorage _storage;

  Future<void> requestCode(String phoneOrEmail) async {
    await _client.dio.post('/api/auth/request-code', data: {
      'identifier': phoneOrEmail,
    });
  }

  Future<Map<String, dynamic>> verifyCode(String phoneOrEmail, String code) async {
    final res = await _client.dio.post('/api/auth/verify-code', data: {
      'identifier': phoneOrEmail,
      'code': code,
    });
    final data = res.data as Map<String, dynamic>;
    final token = data['token'] ?? data['sessionToken'];
    if (token != null) {
      await _storage.write(key: 'auth_token', value: token.toString());
    }
    return data;
  }

  Future<Map<String, dynamic>> getMe() async {
    final res = await _client.dio.get('/api/auth/me');
    return res.data as Map<String, dynamic>;
  }

  Future<void> logout() async {
    try {
      await _client.dio.post('/api/auth/logout');
    } catch (_) {}
    await _storage.delete(key: 'auth_token');
  }

  Future<void> deleteAccount() async {
    await _client.dio.delete('/api/me');
    await _storage.delete(key: 'auth_token');
  }
}
