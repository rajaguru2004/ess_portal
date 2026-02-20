import 'dart:convert';
import 'package:http/http.dart' as http;
import '../consts/api_consts.dart';
import '../services/storage_service.dart';
import '../models/leave_model.dart';

class LeaveProvider {
  final StorageService _storageService = StorageService();

  Future<String?> _getToken() async {
    return await _storageService.getToken();
  }

  Future<Map<String, String>> _getHeaders() async {
    final token = await _getToken();
    return {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    };
  }

  Future<LeaveBalanceResponse> getLeaveBalance() async {
    final uri = Uri.parse('${ApiConsts.baseUrl}${ApiEndpoints.leaveBalance}');
    final response = await http.get(uri, headers: await _getHeaders());

    if (response.statusCode == 200) {
      return LeaveBalanceResponse.fromJson(jsonDecode(response.body));
    } else {
      throw Exception(_parseError(response));
    }
  }

  Future<LeaveTypeResponse> getLeaveTypes() async {
    final uri = Uri.parse('${ApiConsts.baseUrl}${ApiEndpoints.leaveTypes}');
    final response = await http.get(uri, headers: await _getHeaders());

    if (response.statusCode == 200) {
      return LeaveTypeResponse.fromJson(jsonDecode(response.body));
    } else {
      throw Exception(_parseError(response));
    }
  }

  Future<MyLeavesResponse> getMyLeaves(int year) async {
    final uri = Uri.parse(
      '${ApiConsts.baseUrl}${ApiEndpoints.myLeaves}?year=$year',
    );
    final response = await http.get(uri, headers: await _getHeaders());

    if (response.statusCode == 200) {
      return MyLeavesResponse.fromJson(jsonDecode(response.body));
    } else {
      throw Exception(_parseError(response));
    }
  }

  Future<ApplyLeaveResponse> applyLeave({
    required String leaveTypeId,
    required String startDate,
    required String endDate,
    required String reason,
    String? halfDayType,
  }) async {
    final uri = Uri.parse('${ApiConsts.baseUrl}${ApiEndpoints.applyLeave}');
    final body = jsonEncode({
      'leaveTypeId': leaveTypeId,
      'startDate': startDate,
      'endDate': endDate,
      'reason': reason,
      'halfDayType': halfDayType,
    });

    final response = await http.post(
      uri,
      headers: await _getHeaders(),
      body: body,
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      return ApplyLeaveResponse.fromJson(jsonDecode(response.body));
    } else {
      throw Exception(_parseError(response));
    }
  }

  Future<bool> cancelLeave(String leaveId) async {
    final url = '${ApiConsts.baseUrl}${ApiEndpoints.cancelLeave}'.replaceFirst(
      '{id}',
      leaveId,
    );
    final uri = Uri.parse(url);
    final response = await http.delete(uri, headers: await _getHeaders());

    if (response.statusCode == 200) {
      return true;
    } else {
      throw Exception(_parseError(response));
    }
  }

  String _parseError(http.Response response) {
    try {
      final body = jsonDecode(response.body);
      return body['message'] ??
          'Request failed with status: ${response.statusCode}';
    } catch (_) {
      return 'Request failed with status: ${response.statusCode}';
    }
  }
}
