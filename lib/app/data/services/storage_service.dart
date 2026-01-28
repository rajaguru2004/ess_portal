import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/user_model.dart';
import '../models/login_response_model.dart';

class StorageService {
  final _storage = const FlutterSecureStorage();
  static const _tokenKey = 'auth_token';
  static const _userKey = 'user_data';

  /// Save authentication data (token and user)
  Future<void> saveAuthData(LoginData data) async {
    await _storage.write(key: _tokenKey, value: data.accessToken);
    await _storage.write(key: _userKey, value: jsonEncode(data.user.toJson()));
  }

  /// Get stored access token
  Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  /// Get stored user data
  Future<User?> getUser() async {
    final userStr = await _storage.read(key: _userKey);
    if (userStr != null) {
      try {
        return User.fromJson(jsonDecode(userStr));
      } catch (e) {
        print('Error parsing stored user data: $e');
        return null;
      }
    }
    return null;
  }

  /// Clear all authentication data
  Future<void> clearAuthData() async {
    await _storage.delete(key: _tokenKey);
    await _storage.delete(key: _userKey);
  }
}
