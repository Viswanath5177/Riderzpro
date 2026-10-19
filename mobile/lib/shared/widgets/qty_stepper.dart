import 'package:flutter/material.dart';

import '../../app/theme/app_theme_extension.dart';
import '../../core/haptics.dart';

class QtyStepper extends StatelessWidget {
  const QtyStepper({
    super.key,
    required this.qty,
    required this.onDecrement,
    required this.onIncrement,
    this.small = false,
    this.maxQty = 99,
  });

  final int qty;
  final VoidCallback onDecrement;
  final VoidCallback onIncrement;
  final bool small;
  final int maxQty;

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    final size = small ? 28.0 : 36.0;
    final iconSize = small ? 14.0 : 18.0;
    final fontSize = small ? 13.0 : 15.0;

    return Container(
      height: size,
      decoration: BoxDecoration(
        gradient: ext.pillGradient,
        borderRadius: BorderRadius.circular(100),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _StepBtn(icon: Icons.remove, size: size, iconSize: iconSize, onTap: qty > 0 ? () { Haptics.select(); onDecrement(); } : null),
          SizedBox(
            width: small ? 28 : 36,
            child: Text(
              '$qty',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: fontSize, fontWeight: FontWeight.w700, color: Colors.white),
            ),
          ),
          _StepBtn(icon: Icons.add, size: size, iconSize: iconSize, onTap: qty < maxQty ? () { Haptics.select(); onIncrement(); } : null),
        ],
      ),
    );
  }
}

class _StepBtn extends StatelessWidget {
  const _StepBtn({required this.icon, required this.size, required this.iconSize, this.onTap});
  final IconData icon;
  final double size;
  final double iconSize;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) => SizedBox(
    width: size,
    height: size,
    child: InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(100),
      child: Center(child: Icon(icon, color: Colors.white, size: iconSize)),
    ),
  );
}
