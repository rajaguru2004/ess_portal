import 'dart:convert';
import 'package:http/http.dart' as http;
import '../consts/api_consts.dart';
import '../models/login_response_model.dart';

class AuthService {
  /// Perform login request
  Future<LoginResponse> login(String username, String password) async {
    try {
      final url = Uri.parse('${ApiConsts.baseUrl}${ApiEndpoints.login}');
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'username': username, 'password': password}),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final Map<String, dynamic> body = jsonDecode(response.body);
        return LoginResponse.fromJson(body);
      } else {
        // Try to parse error message from response if available
        try {
          final Map<String, dynamic> body = jsonDecode(response.body);
          return LoginResponse(
            success: false,
            message:
                body['message'] ??
                'Login failed with status: ${response.statusCode}',
          );
        } catch (_) {
          return LoginResponse(
            success: false,
            message: 'Login failed with status: ${response.statusCode}',
          );
        }
      }
    } catch (e) {
      return LoginResponse(success: false, message: 'Connection error: $e');
    }
  }
}
