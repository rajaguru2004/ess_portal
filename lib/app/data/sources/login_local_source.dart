import 'dart:convert';
import 'package:flutter/services.dart';
import '../models/login_response_model.dart';

/// Local data source for login authentication
/// Loads and validates credentials from static JSON file
class LoginLocalSource {
  LoginResponse? _loginResponse;

  /// Load login data from JSON asset
  Future<LoginResponse> getLoginData() async {
    if (_loginResponse != null) {
      return _loginResponse!;
    }

    try {
      // Load JSON from assets
      final String jsonString = await rootBundle.loadString(
        'assets/data/login_response.json',
      );

      // Parse JSON
      final Map<String, dynamic> jsonData = json.decode(jsonString);

      // Convert to model
      _loginResponse = LoginResponse.fromJson(jsonData);

      return _loginResponse!;
    } catch (e) {
      throw Exception('Failed to load login data: $e');
    }
  }

  /// Validate login credentials
  /// Returns true if credentials match, false otherwise
  Future<bool> validateCredentials(String username, String password) async {
    final loginData = await getLoginData();

    return loginData.credentials.username == username &&
        loginData.credentials.password == password;
  }

  /// Get error message for invalid credentials
  Future<String> getInvalidCredentialsError() async {
    final loginData = await getLoginData();
    return loginData.errors.invalid;
  }

  /// Get error message for empty credentials
  Future<String> getEmptyCredentialsError() async {
    final loginData = await getLoginData();
    return loginData.errors.empty;
  }

  /// Get user data after successful login
  Future<LoginResponse> getUserData() async {
    return await getLoginData();
  }
}
