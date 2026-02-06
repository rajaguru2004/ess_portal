import 'package:http/http.dart' as http;
import 'dart:convert';
import '../consts/api_consts.dart';
import '../services/storage_service.dart';
import '../models/shift_model.dart';

class ShiftProvider {
  final StorageService _storageService = StorageService();

  Future<String?> _getToken() async {
    return await _storageService.getToken();
  }

  Future<TodayShiftResponse> getTodayShifts() async {
    final token = await _getToken();
    final uri = Uri.parse('${ApiConsts.baseUrl}${ApiEndpoints.shiftsToday}');

    print('🔵 [ShiftProvider] getTodayShifts: Starting Request');
    print('   URL: $uri');

    final response = await http.get(
      uri,
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    print('🟣 [ShiftProvider] getTodayShifts: Response Received');
    print('   Status Code: ${response.statusCode}');
    print('   Body: ${response.body}');

    if (response.statusCode == 200) {
      return TodayShiftResponse.fromJson(jsonDecode(response.body));
    } else {
      try {
        final errorBody = jsonDecode(response.body);
        throw Exception(
          errorBody['message'] ?? 'Failed to fetch today\'s shifts',
        );
      } catch (_) {
        throw Exception(
          'Failed to fetch today\'s shifts: ${response.statusCode}',
        );
      }
    }
  }

  Future<UpcomingShiftResponse> getUpcomingShifts() async {
    final token = await _getToken();
    final uri = Uri.parse('${ApiConsts.baseUrl}${ApiEndpoints.shiftsUpcoming}');

    print('🔵 [ShiftProvider] getUpcomingShifts: Starting Request');
    print('   URL: $uri');

    final response = await http.get(
      uri,
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    print('🟣 [ShiftProvider] getUpcomingShifts: Response Received');
    print('   Status Code: ${response.statusCode}');
    print('   Body: ${response.body}');

    if (response.statusCode == 200) {
      return UpcomingShiftResponse.fromJson(jsonDecode(response.body));
    } else {
      try {
        final errorBody = jsonDecode(response.body);
        throw Exception(
          errorBody['message'] ?? 'Failed to fetch upcoming shifts',
        );
      } catch (_) {
        throw Exception(
          'Failed to fetch upcoming shifts: ${response.statusCode}',
        );
      }
    }
  }
}
