import 'package:ess_portal/app/theme/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

/// Centralized theme configuration for the application
/// Provides both Light and Dark theme configurations
class AppTheme {
  AppTheme._();

  /// Central font style derived from GoogleFonts
  /// Change this to another GoogleFont to update the entire app
  static TextStyle get globalFont => GoogleFonts.montserrat();

  /// Simplified font family name for use in ThemeData
  static String? get fontFamily => globalFont.fontFamily;

  /// Light Theme Configuration
  static ThemeData lightTheme() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      fontFamily: fontFamily,

      // Color Scheme
      colorScheme: const ColorScheme.light(
        primary: AppColors.lightPrimary,
        secondary: AppColors.lightSecondary,
        surface: AppColors.lightSurface,
        error: AppColors.lightError,
        onPrimary: AppColors.lightButtonText,
        onSecondary: AppColors.lightButtonText,
        onSurface: AppColors.lightTextPrimary,
        onError: AppColors.lightButtonText,
      ),

      // Scaffold Background
      scaffoldBackgroundColor: AppColors.lightBackground,

      // AppBar Theme
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        elevation: 0,
        backgroundColor: AppColors.lightSurface,
        foregroundColor: AppColors.lightTextPrimary,
        iconTheme: IconThemeData(color: AppColors.lightTextPrimary),
      ),

      // Text Theme
      textTheme: GoogleFonts.montserratTextTheme(
        TextTheme(
          displayLarge: AppTheme.globalFont.copyWith(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: AppColors.lightTextPrimary,
          ),
          displayMedium: AppTheme.globalFont.copyWith(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: AppColors.lightTextPrimary,
          ),
          displaySmall: AppTheme.globalFont.copyWith(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: AppColors.lightTextPrimary,
          ),
          headlineMedium: AppTheme.globalFont.copyWith(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: AppColors.lightTextPrimary,
          ),
          titleLarge: AppTheme.globalFont.copyWith(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: AppColors.lightTextPrimary,
          ),
          titleMedium: AppTheme.globalFont.copyWith(
            fontSize: 16,
            fontWeight: FontWeight.w500,
            color: AppColors.lightTextPrimary,
          ),
          bodyLarge: AppTheme.globalFont.copyWith(
            fontSize: 16,
            color: AppColors.lightTextPrimary,
          ),
          bodyMedium: AppTheme.globalFont.copyWith(
            fontSize: 14,
            color: AppColors.lightTextPrimary,
          ),
          bodySmall: AppTheme.globalFont.copyWith(
            fontSize: 12,
            color: AppColors.lightTextSecondary,
          ),
          labelLarge: AppTheme.globalFont.copyWith(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: AppColors.lightTextSecondary,
          ),
        ),
      ),

      // Input Decoration Theme
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.lightSurface,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 16,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(
            color: AppColors.lightBorder,
            width: 1.5,
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(
            color: AppColors.lightBorder,
            width: 1.5,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.lightPrimary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.lightError, width: 1.5),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.lightError, width: 2),
        ),
        labelStyle: AppTheme.globalFont.copyWith(
          color: AppColors.lightTextSecondary,
        ),
        hintStyle: AppTheme.globalFont.copyWith(color: AppColors.lightTextHint),
        errorStyle: AppTheme.globalFont.copyWith(color: AppColors.lightError),
      ),

      // Elevated Button Theme
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.lightPrimary,
          foregroundColor: AppColors.lightButtonText,
          disabledBackgroundColor: AppColors.lightButtonDisabled,
          disabledForegroundColor: AppColors.lightTextHint,
          elevation: 2,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: AppTheme.globalFont.copyWith(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),

      // Text Button Theme
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.lightPrimary,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          textStyle: AppTheme.globalFont.copyWith(
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),

      // Icon Theme
      iconTheme: const IconThemeData(
        color: AppColors.lightTextSecondary,
        size: 24,
      ),

      // Divider Theme
      dividerTheme: const DividerThemeData(
        color: AppColors.lightDivider,
        thickness: 1,
      ),
    );
  }

  /// Dark Theme Configuration
  static ThemeData darkTheme() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      fontFamily: fontFamily,

      // Color Scheme
      colorScheme: const ColorScheme.dark(
        primary: AppColors.darkPrimary,
        secondary: AppColors.darkSecondary,
        surface: AppColors.darkSurface,
        error: AppColors.darkError,
        onPrimary: AppColors.darkButtonText,
        onSecondary: AppColors.darkButtonText,
        onSurface: AppColors.darkTextPrimary,
        onError: AppColors.darkButtonText,
      ),

      // Scaffold Background
      scaffoldBackgroundColor: AppColors.darkBackground,

      // AppBar Theme
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        elevation: 0,
        backgroundColor: AppColors.darkSurface,
        foregroundColor: AppColors.darkTextPrimary,
        iconTheme: IconThemeData(color: AppColors.darkTextPrimary),
      ),

      // Text Theme
      textTheme: GoogleFonts.montserratTextTheme(
        TextTheme(
          displayLarge: AppTheme.globalFont.copyWith(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: AppColors.darkTextPrimary,
          ),
          displayMedium: AppTheme.globalFont.copyWith(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: AppColors.darkTextPrimary,
          ),
          displaySmall: AppTheme.globalFont.copyWith(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: AppColors.darkTextPrimary,
          ),
          headlineMedium: AppTheme.globalFont.copyWith(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: AppColors.darkTextPrimary,
          ),
          titleLarge: AppTheme.globalFont.copyWith(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: AppColors.darkTextPrimary,
          ),
          titleMedium: AppTheme.globalFont.copyWith(
            fontSize: 16,
            fontWeight: FontWeight.w500,
            color: AppColors.darkTextPrimary,
          ),
          bodyLarge: AppTheme.globalFont.copyWith(
            fontSize: 16,
            color: AppColors.darkTextPrimary,
          ),
          bodyMedium: AppTheme.globalFont.copyWith(
            fontSize: 14,
            color: AppColors.darkTextPrimary,
          ),
          bodySmall: AppTheme.globalFont.copyWith(
            fontSize: 12,
            color: AppColors.darkTextSecondary,
          ),
          labelLarge: AppTheme.globalFont.copyWith(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: AppColors.darkTextSecondary,
          ),
        ),
      ),

      // Input Decoration Theme
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.darkSurface,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 16,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.darkBorder, width: 1.5),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.darkBorder, width: 1.5),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.darkPrimary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.darkError, width: 1.5),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.darkError, width: 2),
        ),
        labelStyle: AppTheme.globalFont.copyWith(
          color: AppColors.darkTextSecondary,
        ),
        hintStyle: AppTheme.globalFont.copyWith(color: AppColors.darkTextHint),
        errorStyle: AppTheme.globalFont.copyWith(color: AppColors.darkError),
      ),

      // Elevated Button Theme
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.darkPrimary,
          foregroundColor: AppColors.darkButtonText,
          disabledBackgroundColor: AppColors.darkButtonDisabled,
          disabledForegroundColor: AppColors.darkTextHint,
          elevation: 2,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: AppTheme.globalFont.copyWith(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),

      // Text Button Theme
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.darkPrimary,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          textStyle: AppTheme.globalFont.copyWith(
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),

      // Icon Theme
      iconTheme: const IconThemeData(
        color: AppColors.darkTextSecondary,
        size: 24,
      ),

      // Divider Theme
      dividerTheme: const DividerThemeData(
        color: AppColors.darkDivider,
        thickness: 1,
      ),
    );
  }
}
