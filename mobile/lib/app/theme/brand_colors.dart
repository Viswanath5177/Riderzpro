import 'package:flutter/material.dart';

class BrandColors {
  BrandColors._();

  static const primaryRed = Color(0xFFE63329);
  static const deepRed    = Color(0xFF8F1810);
  static const graphite   = Color(0xFF14161A);
  static const offWhite   = Color(0xFFF6F6F4);
  static const fieldFill  = Color(0xFFF1F1EF);
  static const success    = Color(0xFF1FA45B);
  static const warning    = Color(0xFFF5A524);
  static const error      = Color(0xFFD92D20);

  static const heroGradient = LinearGradient(
    colors: [primaryRed, deepRed],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const _ColorScheme light = _ColorScheme(
    background: Color(0xFFF6F6F4),
    onBackground: Color(0xFF14161A),
    surface: Colors.white,
    onSurface: Color(0xFF52555E),
  );

  static const _ColorScheme dark = _ColorScheme(
    background: Color(0xFF0E1014),
    onBackground: Color(0xFFF0F0EE),
    surface: Color(0xFF14161A),
    onSurface: Color(0xFFB0B2BA),
  );
}

class _ColorScheme {
  final Color background;
  final Color onBackground;
  final Color surface;
  final Color onSurface;
  const _ColorScheme({
    required this.background,
    required this.onBackground,
    required this.surface,
    required this.onSurface,
  });
}
