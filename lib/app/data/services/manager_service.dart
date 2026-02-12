import 'dart:convert';
import 'package:http/http.dart' as http;
import '../consts/api_consts.dart';
import '../models/manager_models.dart';
import 'storage_service.dart';

/// Service class for manager-related API operations
class ManagerService {
  final StorageService _storageService = StorageService();

  /// Get authentication token from storage
  Future<String?> _getToken() async {
    return await _storageService.getToken();
  }

  /// Get all users in the system
  /// GET /api/v1/users
  Future<UserListResponse> getAllUsers() async {
    try {
      final token = await _getToken();
      if (token == null) {
        return UserListResponse(
          success: false,
          message: 'Authentication token not found',
          data: [],
        );
      }

      final url = Uri.parse('${ApiConsts.baseUrl}${ApiEndpoints.users}');
      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> body = jsonDecode(response.body);
        return UserListResponse.fromJson(body);
      } else {
        try {
          final Map<String, dynamic> body = jsonDecode(response.body);
          return UserListResponse(
            success: false,
            message: body['message'] ?? 'Failed to fetch users',
            data: [],
          );
        } catch (_) {
          return UserListResponse(
            success: false,
            message: 'Failed with status: ${response.statusCode}',
            data: [],
          );
        }
      }
    } catch (e) {
      return UserListResponse(
        success: false,
        message: 'Connection error: $e',
        data: [],
      );
    }
  }

  /// Make a user a manager
  /// PATCH /api/v1/users/:id/make-manager
  Future<MakeManagerResponse> makeManager(String userId) async {
    try {
      final token = await _getToken();
      if (token == null) {
        return MakeManagerResponse(
          success: false,
          message: 'Authentication token not found',
        );
      }

      final url = Uri.parse(
        '${ApiConsts.baseUrl}${ApiEndpoints.makeManager.replaceAll('{id}', userId)}',
      );

      final response = await http.patch(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final Map<String, dynamic> body = jsonDecode(response.body);

      if (response.statusCode == 200 || response.statusCode == 201) {
        return MakeManagerResponse.fromJson(body);
      } else {
        return MakeManagerResponse(
          success: false,
          message: body['message'] ?? 'Failed to make user a manager',
        );
      }
    } catch (e) {
      return MakeManagerResponse(
        success: false,
        message: 'Connection error: $e',
      );
    }
  }

  /// Get all managers with their subordinates
  /// GET /api/v1/users/managers
  Future<ManagerHierarchyResponse> getManagers() async {
    try {
      final token = await _getToken();
      if (token == null) {
        return ManagerHierarchyResponse(
          success: false,
          message: 'Authentication token not found',
          data: [],
        );
      }

      final url = Uri.parse('${ApiConsts.baseUrl}${ApiEndpoints.managers}');
      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> body = jsonDecode(response.body);
        return ManagerHierarchyResponse.fromJson(body);
      } else {
        try {
          final Map<String, dynamic> body = jsonDecode(response.body);
          return ManagerHierarchyResponse(
            success: false,
            message: body['message'] ?? 'Failed to fetch managers',
            data: [],
          );
        } catch (_) {
          return ManagerHierarchyResponse(
            success: false,
            message: 'Failed with status: ${response.statusCode}',
            data: [],
          );
        }
      }
    } catch (e) {
      return ManagerHierarchyResponse(
        success: false,
        message: 'Connection error: $e',
        data: [],
      );
    }
  }

  /// Get user hierarchy (manager and subordinates)
  /// GET /api/v1/users/:id/hierarchy
  Future<UserHierarchyResponse> getUserHierarchy(String userId) async {
    try {
      final token = await _getToken();
      if (token == null) {
        return UserHierarchyResponse(
          success: false,
          message: 'Authentication token not found',
        );
      }

      final url = Uri.parse(
        '${ApiConsts.baseUrl}${ApiEndpoints.userHierarchy.replaceAll('{id}', userId)}',
      );

      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final Map<String, dynamic> body = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return UserHierarchyResponse.fromJson(body);
      } else {
        return UserHierarchyResponse(
          success: false,
          message: body['message'] ?? 'Failed to fetch user hierarchy',
        );
      }
    } catch (e) {
      return UserHierarchyResponse(
        success: false,
        message: 'Connection error: $e',
      );
    }
  }

  /// Assign an employee to a manager
  /// PATCH /api/v1/users/:employeeId/assign-manager
  Future<AssignManagerResponse> assignManager(
    String employeeId,
    String managerId,
  ) async {
    try {
      final token = await _getToken();
      if (token == null) {
        return AssignManagerResponse(
          success: false,
          message: 'Authentication token not found',
        );
      }

      final url = Uri.parse(
        '${ApiConsts.baseUrl}${ApiEndpoints.assignManager.replaceAll('{employeeId}', employeeId)}',
      );

      final response = await http.patch(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'managerId': managerId}),
      );

      final Map<String, dynamic> body = jsonDecode(response.body);

      if (response.statusCode == 200 || response.statusCode == 201) {
        return AssignManagerResponse.fromJson(body);
      } else {
        return AssignManagerResponse(
          success: false,
          message: body['message'] ?? 'Failed to assign employee to manager',
        );
      }
    } catch (e) {
      return AssignManagerResponse(
        success: false,
        message: 'Connection error: $e',
      );
    }
  }
}
