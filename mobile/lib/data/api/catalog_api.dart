import 'package:dio/dio.dart';
import 'api_client.dart';

class CatalogApi {
  CatalogApi(this._client);
  final ApiClient _client;

  Future<List<Map<String, dynamic>>> getProducts({
    String? q,
    String? category,
    String? fitVehicle,
    String? sellerId,
  }) async {
    final res = await _client.dio.get('/api/products', queryParameters: {
      if (q != null && q.isNotEmpty) 'q': q,
      if (category != null) 'category': category,
      if (fitVehicle != null) 'fit_vehicle': fitVehicle,
      if (sellerId != null) 'seller_id': sellerId,
    });
    return (res.data as List<dynamic>).cast<Map<String, dynamic>>();
  }

  Future<List<Map<String, dynamic>>> getCategories() async {
    final res = await _client.dio.get('/api/categories');
    return (res.data as List<dynamic>).cast<Map<String, dynamic>>();
  }

  Future<List<Map<String, dynamic>>> getSellers() async {
    final res = await _client.dio.get('/api/sellers');
    return (res.data as List<dynamic>).cast<Map<String, dynamic>>();
  }
}
