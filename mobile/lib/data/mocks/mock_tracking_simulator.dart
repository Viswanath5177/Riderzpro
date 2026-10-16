import 'dart:async';
import 'dart:math' as math;
import 'package:latlong2/latlong.dart';

/// Delhi coordinates polyline: Connaught Place -> Karol Bagh -> Rohini / Saket
class MockTrackingSimulator {
  MockTrackingSimulator({
    required this.deliveryId,
    required this.orderId,
  }) {
    _initRoute();
  }

  final String deliveryId;
  final String orderId;

  static const List<LatLng> _delhiWaypoints = [
    LatLng(28.6315, 77.2167), // Connaught Place (Merchant Hub)
    LatLng(28.6420, 77.2050), // Pusa Road
    LatLng(28.6517, 77.1906), // Karol Bagh Market
    LatLng(28.6650, 77.1700), // Patel Nagar
    LatLng(28.6800, 77.1500), // Punjabi Bagh
    LatLng(28.7041, 77.1025), // Rohini Dropoff
  ];

  late final List<LatLng> _route;
  int _currentIndex = 0;
  Timer? _ticker;
  final _eventController = StreamController<Map<String, dynamic>>.broadcast();

  Stream<Map<String, dynamic>> get eventStream => _eventController.stream;

  void _initRoute() {
    _route = List.from(_delhiWaypoints);
  }

  void start({Duration interval = const Duration(seconds: 4)}) {
    _ticker?.cancel();
    _emitSnapshot();

    _ticker = Timer.periodic(interval, (timer) {
      if (_currentIndex < _route.length - 1) {
        _currentIndex++;
        final currentPos = _route[_currentIndex];
        final dest = _route.last;

        const dist = Distance();
        final distanceToDropoff = dist.as(LengthUnit.Meter, currentPos, dest);
        final isApproaching = distanceToDropoff <= 500;
        final isArrived = distanceToDropoff <= 50;

        _eventController.add({
          'event': 'RIDER_LOCATION_UPDATED',
          'delivery_id': deliveryId,
          'latitude': currentPos.latitude,
          'longitude': currentPos.longitude,
          'distance_to_dropoff_meters': distanceToDropoff,
          'eta_minutes': math.max(1, (distanceToDropoff / 350).round()),
          'is_approaching': isApproaching,
          'is_arrived': isArrived,
        });

        if (isApproaching && !isArrived) {
          _eventController.add({
            'event': 'RIDER_APPROACHING',
            'delivery_id': deliveryId,
            'message': 'Rider is approaching your location within 500m',
          });
        }

        if (isArrived) {
          _eventController.add({
            'event': 'RIDER_ARRIVED',
            'delivery_id': deliveryId,
            'message': 'Rider has arrived at your doorstep!',
          });
          _eventController.add({
            'event': 'DELIVERY_STATUS_UPDATED',
            'status': 'DELIVERED',
            'delivery_id': deliveryId,
          });
          _eventController.add({
            'event': 'DELIVERY_COMPLETED',
            'delivery_id': deliveryId,
          });
          timer.cancel();
        }
      }
    });
  }

  void _emitSnapshot() {
    final startPos = _route.first;
    final dest = _route.last;
    const dist = Distance();
    final totalDist = dist.as(LengthUnit.Meter, startPos, dest);

    _eventController.add({
      'event': 'INITIAL_TRACKING_SNAPSHOT',
      'delivery_id': deliveryId,
      'order_id': orderId,
      'status': 'OUT_FOR_DELIVERY',
      'rider': {
        'name': 'Rahul Verma',
        'phone': '+91 98765 43210',
        'vehicle': 'Honda Activa 6G (DL-3S-CF-1029)',
        'rating': 4.9,
      },
      'current_latitude': startPos.latitude,
      'current_longitude': startPos.longitude,
      'dropoff_latitude': dest.latitude,
      'dropoff_longitude': dest.longitude,
      'distance_to_dropoff_meters': totalDist,
      'eta_minutes': 18,
    });
  }

  void stop() {
    _ticker?.cancel();
    _ticker = null;
  }

  void dispose() {
    stop();
    _eventController.close();
  }
}
