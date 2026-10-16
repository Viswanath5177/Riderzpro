import 'package:dio/dio.dart';
import 'api_client.dart';

class PaymentsApi {
  PaymentsApi(this._client);
  final ApiClient _client;

  Future<Map<String, dynamic>> createRazorpayOrder({
    required int amountPaise,
    required String currency,
    required String receipt,
    Map<String, dynamic>? notes,
  }) async {
    final res = await _client.dio.post('/api/payments/create-order', data: {
      'amount': amountPaise,
      'currency': currency,
      'receipt': receipt,
      if (notes != null) 'notes': notes,
    });
    return res.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> verifyRazorpay({
    required String razorpayOrderId,
    required String razorpayPaymentId,
    required String razorpaySignature,
  }) async {
    final res = await _client.dio.post('/api/payments/verify', data: {
      'razorpay_order_id': razorpayOrderId,
      'razorpay_payment_id': razorpayPaymentId,
      'razorpay_signature': razorpaySignature,
    });
    return res.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> confirmCod({required String orderId}) async {
    final res = await _client.dio.post('/api/payments/cod', data: {
      'order_id': orderId,
    });
    return res.data as Map<String, dynamic>;
  }
}
