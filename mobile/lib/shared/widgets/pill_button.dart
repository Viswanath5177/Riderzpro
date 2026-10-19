import 'package:flutter/material.dart';

import '../../app/theme/app_theme_extension.dart';
import '../../app/theme/brand_colors.dart';
import '../../core/haptics.dart';

class PillButton extends StatelessWidget {
  const PillButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.loading = false,
    this.outlined = false,
    this.small = false,
    this.gradient,
    this.backgroundColor,
    this.foregroundColor,
    this.minWidth,
    this.semanticLabel,
  });

  final String label;
  final VoidCallback? onPressed;
  final Widget? icon;
  final bool loading;
  final bool outlined;
  final bool small;
  final LinearGradient? gradient;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final double? minWidth;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    final height = small ? 40.0 : 52.0;
    final fontSize = small ? 14.0 : 16.0;

    if (outlined) {
      return Semantics(
        label: semanticLabel ?? label,
        button: true,
        child: OutlinedButton.icon(
          onPressed: onPressed == null ? null : () { Haptics.light(); onPressed!(); },
          icon: icon ?? const SizedBox.shrink(),
          label: Text(label, style: TextStyle(fontSize: fontSize, fontWeight: FontWeight.w600)),
          style: OutlinedButton.styleFrom(
            minimumSize: Size(minWidth ?? double.infinity, height),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(100)),
            side: BorderSide(color: ext.primaryRed),
            foregroundColor: ext.primaryRed,
          ),
        ),
      );
    }

    return Semantics(
      label: semanticLabel ?? label,
      button: true,
      child: GestureDetector(
        onTap: onPressed == null ? null : () { Haptics.medium(); onPressed!(); },
        child: Container(
          height: height,
          constraints: BoxConstraints(minWidth: minWidth ?? double.infinity),
          decoration: BoxDecoration(
            gradient: gradient ?? ext.pillGradient,
            color: gradient == null ? (backgroundColor ?? ext.primaryRed) : null,
            borderRadius: BorderRadius.circular(100),
          ),
          alignment: Alignment.center,
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: loading
              ? const SizedBox(
                  width: 22, height: 22,
                  child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white),
                )
              : Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (icon != null) ...[icon!, const SizedBox(width: 8)],
                    Text(
                      label,
                      style: TextStyle(
                        fontSize: fontSize,
                        fontWeight: FontWeight.w700,
                        color: foregroundColor ?? Colors.white,
                      ),
                    ),
                  ],
                ),
        ),
      ),
    );
  }
}
