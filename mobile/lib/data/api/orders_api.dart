import 'package:dio/dio.dart';
import 'api_client.dart';

class OrdersApi {
  OrdersApi(this._client);
  final ApiClient _client;

  Future<Map<String, dynamic>> createOrder(Map<String, dynamic> orderPayload) async {
    final res = await _client.dio.post('/api/orders', data: orderPayload);
    return res.data as Map<String, dynamic>;
  }

  Future<List<Map<String, dynamic>>> getMyOrders() async {
    final res = await _client.dio.get('/api/orders/mine');
    return (res.data as List<dynamic>).cast<Map<String, dynamic>>();
  }

  Future<Map<String, dynamic>> getOrderDetail(String orderId) async {
    final res = await _client.dio.get('/api/orders/$orderId');
    return res.data as Map<String, dynamic>;
  }

  String getInvoiceUrl(String orderId) =>
      '${_client.dio.options.baseUrl}/api/invoices/$orderId?format=html';
}
