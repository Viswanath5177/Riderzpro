import 'dart:developer' as dev;
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../core/env/config.dart';

class ApiException implements Exception {
  ApiException({required this.message, this.code, this.statusCode, this.requestId});
  final String message;
  final String? code;
  final int? statusCode;
  final String? requestId;

  @override
  String toString() => 'ApiException($statusCode, code: $code): $message';
}

class ApiClient {
  ApiClient({FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage() {
    _dio = Dio(BaseOptions(
      baseUrl: AppConfig.apiUrl,
      connectTimeout: const Duration(seconds: 12),
      receiveTimeout: const Duration(seconds: 15),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    ));

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        try {
          final token = await _storage.read(key: 'auth_token');
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
        } catch (_) {}
        return handler.next(options);
      },
      onError: (DioException e, handler) {
        dev.log('API Error: ${e.response?.statusCode} ${e.requestOptions.uri}', name: 'ApiClient');
        final data = e.response?.data;
        if (data is Map<String, dynamic> && data['error'] != null) {
          final errMap = data['error'] as Map<String, dynamic>;
          final customEx = ApiException(
            message: errMap['message']?.toString() ?? e.message ?? 'Unknown error',
            code: errMap['code']?.toString(),
            statusCode: e.response?.statusCode,
            requestId: errMap['requestId']?.toString(),
          );
          return handler.reject(DioException(
            requestOptions: e.requestOptions,
            response: e.response,
            type: e.type,
            error: customEx,
          ));
        }
        return handler.next(e);
      },
    ));
  }

  final FlutterSecureStorage _storage;
  late final Dio _dio;

  Dio get dio => _dio;
}
