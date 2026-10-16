import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:riderzpro/domain/order_status.dart';

void main() {
  group('OrderStatus Mapping Tests', () {
    test('Timeline steps map accurately', () {
      expect(OrderStatus.toStep('PLACED'), OrderStep.placed);
      expect(OrderStatus.toStep('CONFIRMED'), OrderStep.placed);
      expect(OrderStatus.toStep('PACKED'), OrderStep.packed);
      expect(OrderStatus.toStep('VENDOR_ACCEPTED'), OrderStep.packed);
      expect(OrderStatus.toStep('RIDER_ASSIGNED'), OrderStep.riderAssigned);
      expect(OrderStatus.toStep('PICKED_UP'), OrderStep.inTransit);
      expect(OrderStatus.toStep('DISPATCHED'), OrderStep.inTransit);
      expect(OrderStatus.toStep('SHIPPED'), OrderStep.inTransit);
      expect(OrderStatus.toStep('IN_TRANSIT'), OrderStep.inTransit);
      expect(OrderStatus.toStep('OUT_FOR_DELIVERY'), OrderStep.outForDelivery);
      expect(OrderStatus.toStep('ON_THE_WAY'), OrderStep.outForDelivery);
      expect(OrderStatus.toStep('DELIVERED'), OrderStep.delivered);
    });

    test('Terminal exceptions', () {
      expect(OrderStatus.toTerminal('CANCELLED'), TerminalStatus.cancelled);
      expect(OrderStatus.toTerminal('REFUNDED'), TerminalStatus.refunded);
      expect(OrderStatus.toTerminal('RETURNED'), TerminalStatus.returned);
      expect(OrderStatus.toTerminal('FAILED'), TerminalStatus.failed);
      expect(OrderStatus.isTerminal('CANCELLED'), isTrue);
      expect(OrderStatus.isTerminal('PLACED'), isFalse);
    });

    test('Cancellation allowed only before PICKED_UP', () {
      expect(OrderStatus.canCancel('PLACED'), isTrue);
      expect(OrderStatus.canCancel('PACKED'), isTrue);
      expect(OrderStatus.canCancel('RIDER_ASSIGNED'), isTrue);
      expect(OrderStatus.canCancel('PICKED_UP'), isFalse);
      expect(OrderStatus.canCancel('IN_TRANSIT'), isFalse);
      expect(OrderStatus.canCancel('DELIVERED'), isFalse);
    });

    test('Rider info displayed only from RIDER_ASSIGNED onward', () {
      expect(OrderStatus.showRiderInfo('PLACED'), isFalse);
      expect(OrderStatus.showRiderInfo('PACKED'), isFalse);
      expect(OrderStatus.showRiderInfo('RIDER_ASSIGNED'), isTrue);
      expect(OrderStatus.showRiderInfo('IN_TRANSIT'), isTrue);
      expect(OrderStatus.showRiderInfo('OUT_FOR_DELIVERY'), isTrue);
      expect(OrderStatus.showRiderInfo('DELIVERED'), isTrue);
    });

    test('Unknown status handles gracefully with title case fallback', () {
      const unknown = 'CUSTOM_VERIFICATION_PENDING';
      expect(OrderStatus.toStep(unknown), isNull);
      expect(OrderStatus.toTerminal(unknown), isNull);
      expect(OrderStatus.label(unknown), 'Custom Verification Pending');
      expect(OrderStatus.chipColor(unknown), isA<Color>());
    });
  });
}
