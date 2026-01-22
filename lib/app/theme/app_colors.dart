import 'package:flutter/material.dart';

/// Centralized color definitions for Light and Dark themes
/// All colors used in the app should come from this class
class AppColors {
  AppColors._(); // Private constructor to prevent instantiation

  // ============= Light Theme Colors =============
  static const Color lightPrimary = Color(0xFF2563EB); // Blue 600
  static const Color lightPrimaryVariant = Color(0xFF1E40AF); // Blue 700
  static const Color lightSecondary = Color(0xFF10B981); // Green 500
  static const Color lightSecondaryVariant = Color(0xFF059669); // Green 600

  static const Color lightBackground = Color(0xFFF9FAFB); // Gray 50
  static const Color lightSurface = Color(0xFFFFFFFF); // White
  static const Color lightError = Color(0xFFDC2626); // Red 600
  static const Color lightSuccess = Color(0xFF10B981); // Green 500

  static const Color lightTextPrimary = Color(0xFF111827); // Gray 900
  static const Color lightTextSecondary = Color(0xFF6B7280); // Gray 500
  static const Color lightTextHint = Color(0xFF9CA3AF); // Gray 400

  static const Color lightDivider = Color(0xFFE5E7EB); // Gray 200
  static const Color lightBorder = Color(0xFFD1D5DB); // Gray 300

  static const Color lightButtonDisabled = Color(0xFFE5E7EB); // Gray 200
  static const Color lightButtonText = Color(0xFFFFFFFF); // White

  // ============= Dark Theme Colors =============
  static const Color darkPrimary = Color(0xFF3B82F6); // Blue 500
  static const Color darkPrimaryVariant = Color(0xFF2563EB); // Blue 600
  static const Color darkSecondary = Color(0xFF34D399); // Green 400
  static const Color darkSecondaryVariant = Color(0xFF10B981); // Green 500

  static const Color darkBackground = Color(0xFF111827); // Gray 900
  static const Color darkSurface = Color(0xFF1F2937); // Gray 800
  static const Color darkError = Color(0xFFEF4444); // Red 500
  static const Color darkSuccess = Color(0xFF34D399); // Green 400

  static const Color darkTextPrimary = Color(0xFFF9FAFB); // Gray 50
  static const Color darkTextSecondary = Color(0xFF9CA3AF); // Gray 400
  static const Color darkTextHint = Color(0xFF6B7280); // Gray 500

  static const Color darkDivider = Color(0xFF374151); // Gray 700
  static const Color darkBorder = Color(0xFF4B5563); // Gray 600

  static const Color darkButtonDisabled = Color(0xFF374151); // Gray 700
  static const Color darkButtonText = Color(0xFFFFFFFF); // White
}
