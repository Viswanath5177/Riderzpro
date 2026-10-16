import 'dart:convert';
import 'package:flutter/services.dart';

import '../models/product_model.dart';
import '../models/ev_model.dart';
import '../models/vendor_model.dart';

class CatalogData {
  const CatalogData({
    required this.accessories,
    required this.evParts,
    required this.evTwoWheelers,
    required this.departments,
    required this.vendors,
  });

  final List<ProductModel> accessories;
  final List<ProductModel> evParts;
  final List<EvModel> evTwoWheelers;
  final List<Map<String, dynamic>> departments;
  final List<VendorModel> vendors;

  List<ProductModel> get allProducts => [...accessories, ...evParts];
}

class CatalogLoader {
  CatalogLoader._();
  static CatalogData? _cache;

  static Future<void> preload() async {
    if (_cache != null) return;
    _cache = await _load();
  }

  static CatalogData get catalog {
    assert(_cache != null, 'Call CatalogLoader.preload() before accessing catalog');
    return _cache!;
  }

  static Future<CatalogData> _load() async {
    final raw = await rootBundle.loadString('assets/data/catalog.json');
    final Map<String, dynamic> json = jsonDecode(raw) as Map<String, dynamic>;

    final accs = ((json['accessories'] as List<dynamic>?) ?? [])
        .map((e) => ProductModel.fromJson(e as Map<String, dynamic>))
        .toList();

    final evParts = ((json['evParts'] as List<dynamic>?) ?? [])
        .map((e) => ProductModel.fromJson(e as Map<String, dynamic>))
        .toList();

    final evs = ((json['evTwoWheelers'] as List<dynamic>?) ?? [])
        .map((e) => EvModel.fromJson(e as Map<String, dynamic>))
        .toList();

    final depts = ((json['departments'] as List<dynamic>?) ?? [])
        .map((e) => e as Map<String, dynamic>)
        .toList();

    final vendors = ((json['vendors'] as List<dynamic>?) ?? [])
        .map((e) => VendorModel.fromJson(e as Map<String, dynamic>))
        .toList();

    return CatalogData(
      accessories: accs,
      evParts: evParts,
      evTwoWheelers: evs,
      departments: depts,
      vendors: vendors,
    );
  }
}
