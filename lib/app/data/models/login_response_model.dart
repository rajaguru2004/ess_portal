import 'user_model.dart';

/// Login response model aggregating all authentication data
class LoginResponse {
  final bool success;
  final String message;
  final LoginData? data;

  LoginResponse({required this.success, required this.message, this.data});

  /// Create LoginResponse from JSON
  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      success: json['success'] as bool? ?? false,
      message: json['message'] as String? ?? '',
      data: json['data'] != null
          ? LoginData.fromJson(json['data'] as Map<String, dynamic>)
          : null,
    );
  }

  /// Convert LoginResponse to JSON
  Map<String, dynamic> toJson() {
    return {'success': success, 'message': message, 'data': data?.toJson()};
  }

  @override
  String toString() {
    return 'LoginResponse(success: $success, message: $message, data: $data)';
  }
}

class LoginData {
  final String accessToken;
  final User user;

  LoginData({required this.accessToken, required this.user});

  factory LoginData.fromJson(Map<String, dynamic> json) {
    return LoginData(
      accessToken: json['accessToken'] as String? ?? '',
      user: User.fromJson(json['user'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return {'accessToken': accessToken, 'user': user.toJson()};
  }

  @override
  String toString() {
    return 'LoginData(accessToken: $accessToken, user: $user)';
  }
}
