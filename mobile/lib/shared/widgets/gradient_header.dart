import 'package:flutter/material.dart';
import '../../app/theme/app_theme_extension.dart';

class GradientHeader extends StatelessWidget {
  const GradientHeader({
    super.key,
    required this.height,
    this.backgroundImage,
    this.child,
    this.gradient,
  });

  final double height;
  final String? backgroundImage;
  final Widget? child;
  final LinearGradient? gradient;

  @override
  Widget build(BuildContext context) {
    final ext = AppThemeExtension.of(context);
    return SizedBox(
      height: height,
      width: double.infinity,
      child: Stack(
        fit: StackFit.expand,
        children: [
          if (backgroundImage != null)
            Image.asset(backgroundImage!, fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container()),
          Container(
            decoration: BoxDecoration(
              gradient: gradient ??
                  LinearGradient(
                    colors: [
                      ext.graphite.withOpacity(0.85),
                      ext.primaryRed.withOpacity(0.92),
                    ],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
            ),
          ),
          if (child != null) child!,
        ],
      ),
    );
  }
}
