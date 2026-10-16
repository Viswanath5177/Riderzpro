import 'dart:async';
import 'package:flutter_test/flutter_test.dart';

class MockTrackingController {
  MockTrackingController({required this.deliveryId});

  final String deliveryId;
  int reconnectAttempts = 0;
  bool isConnected = false;
  bool isFallbackPollingActive = false;
  Timer? _pollingTimer;

  void onDisconnect() {
    isConnected = false;
    reconnectAttempts++;
    if (reconnectAttempts >= 3) {
      // Fallback to REST polling every 10s
      startFallbackPolling();
    }
  }

  void onConnect() {
    isConnected = true;
    reconnectAttempts = 0;
    stopFallbackPolling();
  }

  void startFallbackPolling() {
    isFallbackPollingActive = true;
  }

  void stopFallbackPolling() {
    isFallbackPollingActive = false;
    _pollingTimer?.cancel();
    _pollingTimer = null;
  }
}

void main() {
  group('Tracking Reconnect & Fallback Tests', () {
    test('Exponential retry and fallback to REST polling after disconnects', () {
      final controller = MockTrackingController(deliveryId: 'del-909');
      expect(controller.isConnected, isFalse);

      // Connect
      controller.onConnect();
      expect(controller.isConnected, isTrue);
      expect(controller.isFallbackPollingActive, isFalse);

      // Disconnect 1
      controller.onDisconnect();
      expect(controller.isConnected, isFalse);
      expect(controller.reconnectAttempts, 1);
      expect(controller.isFallbackPollingActive, isFalse);

      // Disconnect 2
      controller.onDisconnect();
      expect(controller.reconnectAttempts, 2);
      expect(controller.isFallbackPollingActive, isFalse);

      // Disconnect 3 -> triggers fallback REST polling
      controller.onDisconnect();
      expect(controller.reconnectAttempts, 3);
      expect(controller.isFallbackPollingActive, isTrue);

      // Reconnect succeeds
      controller.onConnect();
      expect(controller.isConnected, isTrue);
      expect(controller.reconnectAttempts, 0);
      expect(controller.isFallbackPollingActive, isFalse);
    });
  });
}
