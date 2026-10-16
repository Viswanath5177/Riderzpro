import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class GarageVehicle {
  const GarageVehicle({
    required this.id,
    required this.type,    // 'car' | 'bike'
    required this.make,
    required this.model,
    this.year,
    this.vin,
    this.nickname,
  });
  final String id;
  final String type;
  final String make;
  final String model;
  final int? year;
  final String? vin;
  final String? nickname;

  String get displayName => '\$make \$model\${year != null ? " (\$year)" : ""}';

  Map<String, dynamic> toJson() => {
    'id': id, 'type': type, 'make': make, 'model': model,
    'year': year, 'vin': vin, 'nickname': nickname,
  };

  factory GarageVehicle.fromJson(Map<String, dynamic> j) => GarageVehicle(
    id: j['id'] as String, type: j['type'] as String,
    make: j['make'] as String, model: j['model'] as String,
    year: j['year'] as int?, vin: j['vin'] as String?,
    nickname: j['nickname'] as String?,
  );
}

class GarageNotifier extends StateNotifier<List<GarageVehicle>> {
  GarageNotifier() : super(const []) { _load(); }

  String? _activeId;
  String? get activeId => _activeId;
  GarageVehicle? get activeVehicle => state.isEmpty ? null : state.firstWhere(
    (v) => v.id == _activeId, orElse: () => state.first,
  );

  static const _key = 'garage_vehicles';
  static const _activeKey = 'garage_active_id';

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);
    if (raw != null) {
      final list = jsonDecode(raw) as List<dynamic>;
      state = list.map((e) => GarageVehicle.fromJson(e as Map<String, dynamic>)).toList();
    }
    _activeId = prefs.getString(_activeKey);
  }

  Future<void> _save() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, jsonEncode(state.map((v) => v.toJson()).toList()));
    if (_activeId != null) await prefs.setString(_activeKey, _activeId!);
  }

  Future<void> addVehicle(GarageVehicle v) async {
    state = [...state, v];
    _activeId ??= v.id;
    await _save();
  }

  Future<void> removeVehicle(String id) async {
    state = state.where((v) => v.id != id).toList();
    if (_activeId == id) _activeId = state.isNotEmpty ? state.first.id : null;
    await _save();
  }

  Future<void> setActive(String id) async {
    _activeId = id;
    await _save();
    state = [...state]; // trigger rebuild
  }
}

final garageProvider = StateNotifierProvider<GarageNotifier, List<GarageVehicle>>(
  (_) => GarageNotifier(),
);
