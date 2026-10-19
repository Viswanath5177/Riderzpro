import 'package:flutter/material.dart';

class AppThemeExtension extends ThemeExtension<AppThemeExtension> {
  const AppThemeExtension({
    required this.primaryRed,
    required this.deepRed,
    required this.graphite,
    required this.offWhite,
    required this.fieldFill,
    required this.success,
    required this.warning,
    required this.errorColor,
    required this.heroGradient,
    required this.pillGradient,
    required this.cardRadius,
    required this.sheetRadius,
  });

  final Color primaryRed;
  final Color deepRed;
  final Color graphite;
  final Color offWhite;
  final Color fieldFill;
  final Color success;
  final Color warning;
  final Color errorColor;
  final LinearGradient heroGradient;
  final LinearGradient pillGradient;
  final double cardRadius;
  final double sheetRadius;

  @override
  AppThemeExtension copyWith({
    Color? primaryRed,
    Color? deepRed,
    Color? graphite,
    Color? offWhite,
    Color? fieldFill,
    Color? success,
    Color? warning,
    Color? errorColor,
    LinearGradient? heroGradient,
    LinearGradient? pillGradient,
    double? cardRadius,
    double? sheetRadius,
  }) => AppThemeExtension(
    primaryRed: primaryRed ?? this.primaryRed,
    deepRed: deepRed ?? this.deepRed,
    graphite: graphite ?? this.graphite,
    offWhite: offWhite ?? this.offWhite,
    fieldFill: fieldFill ?? this.fieldFill,
    success: success ?? this.success,
    warning: warning ?? this.warning,
    errorColor: errorColor ?? this.errorColor,
    heroGradient: heroGradient ?? this.heroGradient,
    pillGradient: pillGradient ?? this.pillGradient,
    cardRadius: cardRadius ?? this.cardRadius,
    sheetRadius: sheetRadius ?? this.sheetRadius,
  );

  @override
  AppThemeExtension lerp(AppThemeExtension? other, double t) {
    if (other is! AppThemeExtension) return this;
    return AppThemeExtension(
      primaryRed: Color.lerp(primaryRed, other.primaryRed, t)!,
      deepRed: Color.lerp(deepRed, other.deepRed, t)!,
      graphite: Color.lerp(graphite, other.graphite, t)!,
      offWhite: Color.lerp(offWhite, other.offWhite, t)!,
      fieldFill: Color.lerp(fieldFill, other.fieldFill, t)!,
      success: Color.lerp(success, other.success, t)!,
      warning: Color.lerp(warning, other.warning, t)!,
      errorColor: Color.lerp(errorColor, other.errorColor, t)!,
      heroGradient: heroGradient,
      pillGradient: pillGradient,
      cardRadius: cardRadius,
      sheetRadius: sheetRadius,
    );
  }

  static AppThemeExtension of(BuildContext context) =>
      Theme.of(context).extension<AppThemeExtension>() ?? _fallback;

  static const _fallback = AppThemeExtension(
    primaryRed: Color(0xFFE63329),
    deepRed: Color(0xFF8F1810),
    graphite: Color(0xFF14161A),
    offWhite: Color(0xFFF6F6F4),
    fieldFill: Color(0xFFF1F1EF),
    success: Color(0xFF1FA45B),
    warning: Color(0xFFF5A524),
    errorColor: Color(0xFFD92D20),
    heroGradient: LinearGradient(
      colors: [Color(0xFFE63329), Color(0xFF8F1810)],
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
    ),
    pillGradient: LinearGradient(
      colors: [Color(0xFFE63329), Color(0xFFC92017)],
      begin: Alignment.centerLeft,
      end: Alignment.centerRight,
    ),
    cardRadius: 16.0,
    sheetRadius: 28.0,
  );
}
