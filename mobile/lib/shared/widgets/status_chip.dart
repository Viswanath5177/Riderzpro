import 'package:flutter/material.dart';

import '../../domain/order_status.dart';

class StatusChip extends StatelessWidget {
  const StatusChip({super.key, required this.status, this.small = false});

  final String status;
  final bool small;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = OrderStatus.chipColor(status, dark: isDark);
    final fgColor = OrderStatus.chipTextColor(status);
    final label = OrderStatus.label(status);
    final fontSize = small ? 10.0 : 12.0;
    final padding = small
        ? const EdgeInsets.symmetric(horizontal: 8, vertical: 3)
        : const EdgeInsets.symmetric(horizontal: 10, vertical: 5);

    return Container(
      padding: padding,
      decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(100)),
      child: Text(label, style: TextStyle(fontSize: fontSize, fontWeight: FontWeight.w600, color: fgColor)),
    );
  }
}
