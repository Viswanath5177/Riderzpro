import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'brand_colors.dart';
import 'app_theme_extension.dart';

class AppTheme {
  static ThemeData light() => _build(Brightness.light);
  static ThemeData dark() => _build(Brightness.dark);

  static ThemeData _build(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    final colors = isDark ? BrandColors.dark : BrandColors.light;
    final ext = AppThemeExtension(
      primaryRed: BrandColors.primaryRed,
      deepRed: BrandColors.deepRed,
      graphite: BrandColors.graphite,
      offWhite: BrandColors.offWhite,
      fieldFill: isDark ? const Color(0xFF1E2028) : BrandColors.fieldFill,
      success: BrandColors.success,
      warning: BrandColors.warning,
      errorColor: BrandColors.error,
      heroGradient: BrandColors.heroGradient,
      pillGradient: BrandColors.heroGradient,
      cardRadius: 16.0,
      sheetRadius: 28.0,
    );

    final textTheme = GoogleFonts.plusJakartaSansTextTheme(
      TextTheme(
        displayLarge:  TextStyle(fontSize: 57, fontWeight: FontWeight.w700, color: colors.onBackground),
        displayMedium: TextStyle(fontSize: 45, fontWeight: FontWeight.w700, color: colors.onBackground),
        headlineLarge: TextStyle(fontSize: 32, fontWeight: FontWeight.w800, color: colors.onBackground),
        headlineMedium:TextStyle(fontSize: 28, fontWeight: FontWeight.w700, color: colors.onBackground),
        headlineSmall: TextStyle(fontSize: 24, fontWeight: FontWeight.w600, color: colors.onBackground),
        titleLarge:    TextStyle(fontSize: 22, fontWeight: FontWeight.w600, color: colors.onBackground),
        titleMedium:   TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: colors.onBackground),
        titleSmall:    TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: colors.onBackground),
        bodyLarge:     TextStyle(fontSize: 16, fontWeight: FontWeight.w400, color: colors.onBackground),
        bodyMedium:    TextStyle(fontSize: 14, fontWeight: FontWeight.w400, color: colors.onBackground),
        bodySmall:     TextStyle(fontSize: 12, fontWeight: FontWeight.w400, color: colors.onSurface),
        labelLarge:    TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.onBackground),
        labelMedium:   TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: colors.onSurface),
        labelSmall:    TextStyle(fontSize: 10, fontWeight: FontWeight.w500, color: colors.onSurface),
      ),
    );

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: ColorScheme(
        brightness: brightness,
        primary: BrandColors.primaryRed,
        onPrimary: Colors.white,
        primaryContainer: BrandColors.deepRed,
        onPrimaryContainer: Colors.white,
        secondary: BrandColors.graphite,
        onSecondary: Colors.white,
        secondaryContainer: isDark ? const Color(0xFF2A2C34) : const Color(0xFFEEEEEC),
        onSecondaryContainer: isDark ? Colors.white : BrandColors.graphite,
        surface: colors.surface,
        onSurface: colors.onSurface,
        error: BrandColors.error,
        onError: Colors.white,
        background: colors.background,
        onBackground: colors.onBackground,
        surfaceVariant: isDark ? const Color(0xFF1E2028) : const Color(0xFFF1F1EF),
        onSurfaceVariant: isDark ? const Color(0xFFB0B2BA) : const Color(0xFF52555E),
        outline: isDark ? const Color(0xFF3A3C44) : const Color(0xFFD8D8D4),
      ),
      textTheme: textTheme,
      primaryTextTheme: textTheme,
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        titleTextStyle: GoogleFonts.plusJakartaSans(
          fontSize: 18, fontWeight: FontWeight.w700,
          color: isDark ? Colors.white : BrandColors.graphite,
        ),
        iconTheme: IconThemeData(color: isDark ? Colors.white : BrandColors.graphite),
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: isDark ? BrandColors.graphite : Colors.white,
        selectedItemColor: BrandColors.primaryRed,
        unselectedItemColor: isDark ? const Color(0xFF8A8C94) : const Color(0xFF9A9CA4),
        showSelectedLabels: true,
        showUnselectedLabels: true,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
      cardTheme: CardThemeData(
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        color: isDark ? const Color(0xFF1A1C24) : Colors.white,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: isDark ? const Color(0xFF1E2028) : BrandColors.fieldFill,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: BrandColors.primaryRed, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: BrandColors.error, width: 1.5),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: BrandColors.error, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: BrandColors.primaryRed,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 52),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(100)),
          elevation: 0,
          textStyle: GoogleFonts.plusJakartaSans(
            fontSize: 16, fontWeight: FontWeight.w700,
          ),
        ),
      ),
      extensions: [ext],
    );
  }
}
