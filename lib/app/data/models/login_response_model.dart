import 'user_model.dart';
import 'credentials_model.dart';
import 'errors_model.dart';

/// Login response model aggregating all authentication data
class LoginResponse {
  final String status;
  final String message;
  final User user;
  final Credentials credentials;
  final Errors errors;

  LoginResponse({
    required this.status,
    required this.message,
    required this.user,
    required this.credentials,
    required this.errors,
  });

  /// Create LoginResponse from JSON
  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      status: json['status'] as String,
      message: json['message'] as String,
      user: User.fromJson(json['user'] as Map<String, dynamic>),
      credentials: Credentials.fromJson(
        json['credentials'] as Map<String, dynamic>,
      ),
      errors: Errors.fromJson(json['errors'] as Map<String, dynamic>),
    );
  }

  /// Convert LoginResponse to JSON
  Map<String, dynamic> toJson() {
    return {
      'status': status,
      'message': message,
      'user': user.toJson(),
      'credentials': credentials.toJson(),
      'errors': errors.toJson(),
    };
  }

  @override
  String toString() {
    return 'LoginResponse(status: $status, message: $message, user: $user)';
  }
}
