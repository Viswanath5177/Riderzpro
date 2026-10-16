import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../../core/env/config.dart';

class LogisticsApi {
  LogisticsApi() {
    _dio = Dio(BaseOptions(
      baseUrl: AppConfig.logisticsUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 15),
      headers: {
        'Accept': 'application/json',
        'X-User-Role': 'customer',
      },
    ));
  }

  late final Dio _dio;

  Future<Map<String, dynamic>> getDeliverySnapshot(String deliveryId, {String userId = 'cust_1'}) async {
    final res = await _dio.get('/api/deliveries/$deliveryId/tracking', options: Options(
      headers: {'X-User-Id': userId},
    ));
    return res.data as Map<String, dynamic>;
  }

  Future<List<Map<String, dynamic>>> getDeliveryHistory(String deliveryId, {String userId = 'cust_1'}) async {
    final res = await _dio.get('/api/deliveries/$deliveryId/history', options: Options(
      headers: {'X-User-Id': userId},
    ));
    return (res.data as List<dynamic>).cast<Map<String, dynamic>>();
  }

  WebSocketChannel connectTrackingWs(String deliveryId, {String userId = 'cust_1'}) {
    final baseWs = AppConfig.logisticsUrl.replaceFirst('http', 'ws');
    final uri = Uri.parse('$baseWs/ws/deliveries/$deliveryId/tracking?user_id=$userId&user_role=customer');
    return WebSocketChannel.connect(uri);
  }
}
