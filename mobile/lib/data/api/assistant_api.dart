import 'api_client.dart';

class AssistantApi {
  AssistantApi(this._client);
  final ApiClient _client;

  Future<String> chat({required String message, String? orderId}) async {
    final res = await _client.dio.post('/api/assistant/chat', data: {
      'message': message,
      if (orderId != null) 'order_id': orderId,
    });
    final data = res.data as Map<String, dynamic>;
    return data['reply']?.toString() ?? data['message']?.toString() ?? 'I could not process that request.';
  }
}
