import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import '../../../app/theme/app_theme_extension.dart';

class TrackingScreen extends StatefulWidget {
  const TrackingScreen({super.key, required this.orderId});
  final String orderId;
  @override
  State<TrackingScreen> createState() => _TrackingScreenState();
}

class _TrackingScreenState extends State<TrackingScreen> {
  // Mock: Rider moves along a Delhi route
  static const _pickup  = LatLng(28.6315, 77.2167); // CP
  static const _dropoff = LatLng(28.6519, 77.1908); // Karol Bagh
  final _mapCtrl = MapController();
  LatLng _rider = _pickup;
  double _heading = 315;
  double _etaMin = 22;
  Timer? _timer;
  int _tick = 0;
  bool _approaching = false;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 3), (_) => _simulateMove());
  }

  void _simulateMove() {
    if (!mounted) return;
    _tick++;
    final t = (_tick / 20).clamp(0.0, 1.0);
    final lat = _pickup.latitude + (_dropoff.latitude - _pickup.latitude) * t;
    final lng = _pickup.longitude + (_dropoff.longitude - _pickup.longitude) * t;
    final dist = _distance(LatLng(lat, lng), _dropoff);
    setState(() {
      _rider = LatLng(lat, lng);
      _etaMin = (22 * (1 - t)).clamp(1, 22);
      _approaching = dist < 0.5;
    });
  }

  double _distance(LatLng a, LatLng b) {
    const R = 6371.0;
    final dLat = (b.latitude - a.latitude) * pi / 180;
    final dLon = (b.longitude - a.longitude) * pi / 180;
    final x = sin(dLat / 2) * sin(dLat / 2) +
        cos(a.latitude * pi / 180) * cos(b.latitude * pi / 180) * sin(dLon / 2) * sin(dLon / 2);
    return R * 2 * atan2(sqrt(x), sqrt(1 - x));
  }

  @override
  void dispose() { _timer?.cancel(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    return Scaffold(
      body: Stack(
        children: [
          FlutterMap(
            mapController: _mapCtrl,
            options: MapOptions(
              initialCenter: LatLng((_pickup.latitude + _dropoff.latitude) / 2,
                  (_pickup.longitude + _dropoff.longitude) / 2),
              initialZoom: 14,
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.riderzpro.app',
              ),
              PolylineLayer(polylines: [
                Polyline(points: [_pickup, _rider, _dropoff], color: Colors.blue, strokeWidth: 4),
              ]),
              MarkerLayer(markers: [
                Marker(point: _pickup, width: 40, height: 40,
                    child: const Icon(Icons.storefront, color: Colors.green, size: 32)),
                Marker(point: _dropoff, width: 40, height: 40,
                    child: const Icon(Icons.home, color: Colors.red, size: 32)),
                Marker(point: _rider, width: 44, height: 44,
                    child: Container(
                      decoration: BoxDecoration(gradient: ext.pillGradient, shape: BoxShape.circle),
                      child: const Icon(Icons.delivery_dining, color: Colors.white, size: 24),
                    )),
              ]),
            ],
          ),
          // Back button
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Container(
                decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                child: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => Navigator.pop(context)),
              ),
            ),
          ),
          // Bottom card
          Positioned(
            bottom: 0, left: 0, right: 0,
            child: Container(
              padding: EdgeInsets.fromLTRB(20, 20, 20, MediaQuery.of(context).padding.bottom + 20),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.12), blurRadius: 20)],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (_approaching)
                    Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(color: const Color(0xFF1FA45B), borderRadius: BorderRadius.circular(100)),
                      child: const Row(mainAxisSize: MainAxisSize.min, children: [
                        Icon(Icons.notifications_active, color: Colors.white, size: 16),
                        SizedBox(width: 6),
                        Text('Rider is approaching!', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 13)),
                      ]),
                    ),
                  Row(
                    children: [
                      Container(
                        width: 48, height: 48,
                        decoration: BoxDecoration(gradient: ext.pillGradient, shape: BoxShape.circle),
                        child: const Icon(Icons.delivery_dining, color: Colors.white, size: 24),
                      ),
                      const SizedBox(width: 14),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Ravi Kumar', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                            Text('Bajaj CT100 · DL 4S 1234', style: TextStyle(fontSize: 12, color: Colors.grey)),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(gradient: ext.pillGradient, borderRadius: BorderRadius.circular(100)),
                        child: Text('\${_etaMin.round()} min', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 16)),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
