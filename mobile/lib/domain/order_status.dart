import 'package:flutter/material.dart';

enum OrderStep {
  placed, packed, riderAssigned, inTransit, outForDelivery, delivered
}

enum TerminalStatus { cancelled, refunded, returned, failed }

class OrderStatus {
  OrderStatus._();

  static const _stepMap = <String, OrderStep>{
    'PLACED':           OrderStep.placed,
    'CONFIRMED':        OrderStep.placed,
    'PACKED':           OrderStep.packed,
    'VENDOR_ACCEPTED':  OrderStep.packed,
    'RIDER_ASSIGNED':   OrderStep.riderAssigned,
    'PICKED_UP':        OrderStep.inTransit,
    'DISPATCHED':       OrderStep.inTransit,
    'SHIPPED':          OrderStep.inTransit,
    'IN_TRANSIT':       OrderStep.inTransit,
    'OUT_FOR_DELIVERY': OrderStep.outForDelivery,
    'ON_THE_WAY':       OrderStep.outForDelivery,
    'DELIVERED':        OrderStep.delivered,
  };

  static const _terminalMap = <String, TerminalStatus>{
    'CANCELLED': TerminalStatus.cancelled,
    'REFUNDED':  TerminalStatus.refunded,
    'RETURNED':  TerminalStatus.returned,
    'FAILED':    TerminalStatus.failed,
  };

  static OrderStep? toStep(String raw) => _stepMap[raw.toUpperCase()];
  static TerminalStatus? toTerminal(String raw) => _terminalMap[raw.toUpperCase()];

  static bool isTerminal(String raw) => _terminalMap.containsKey(raw.toUpperCase());
  static bool isDelivered(String raw) => raw.toUpperCase() == 'DELIVERED';

  /// Returns true if order can still be cancelled (before PICKED_UP)
  static bool canCancel(String raw) {
    final step = toStep(raw);
    if (step == null) return false;
    return step.index < OrderStep.inTransit.index;
  }

  static bool showRiderInfo(String raw) {
    final step = toStep(raw);
    if (step == null) return false;
    return step.index >= OrderStep.riderAssigned.index;
  }

  static Color chipColor(String raw, {bool dark = false}) {
    final up = raw.toUpperCase();
    if (up == 'DELIVERED') return const Color(0xFF1FA45B);
    if (up == 'CANCELLED' || up == 'FAILED') return const Color(0xFFD92D20);
    if (up == 'REFUNDED' || up == 'RETURNED') return const Color(0xFFF5A524);
    if (up == 'OUT_FOR_DELIVERY' || up == 'ON_THE_WAY') return const Color(0xFF2563EB);
    return dark ? const Color(0xFF3A3C44) : const Color(0xFFE8E8E6);
  }

  static Color chipTextColor(String raw) {
    final up = raw.toUpperCase();
    if (up == 'DELIVERED') return Colors.white;
    if (up == 'CANCELLED' || up == 'FAILED') return Colors.white;
    if (up == 'REFUNDED' || up == 'RETURNED') return Colors.white;
    if (up == 'OUT_FOR_DELIVERY' || up == 'ON_THE_WAY') return Colors.white;
    return const Color(0xFF52555E);
  }

  static String label(String raw) {
    final step = toStep(raw);
    if (step != null) return _stepLabels[step]!;
    final terminal = toTerminal(raw);
    if (terminal != null) return _terminalLabels[terminal]!;
    // Unknown status: log once and return raw
    return _toTitleCase(raw);
  }

  static const _stepLabels = <OrderStep, String>{
    OrderStep.placed:          'Placed',
    OrderStep.packed:          'Packed',
    OrderStep.riderAssigned:   'Rider Assigned',
    OrderStep.inTransit:       'In Transit',
    OrderStep.outForDelivery:  'Out for Delivery',
    OrderStep.delivered:       'Delivered',
  };

  static const _terminalLabels = <TerminalStatus, String>{
    TerminalStatus.cancelled: 'Cancelled',
    TerminalStatus.refunded:  'Refunded',
    TerminalStatus.returned:  'Returned',
    TerminalStatus.failed:    'Failed',
  };

  static String _toTitleCase(String s) =>
      s.split('_').map((w) => w.isEmpty ? w : w[0].toUpperCase() + w.substring(1).toLowerCase()).join(' ');

  static List<OrderStep> get timeline => OrderStep.values;
}
