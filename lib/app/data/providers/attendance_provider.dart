import 'package:camera/camera.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import '../consts/api_consts.dart';
import '../services/storage_service.dart';
import '../models/attendance_models.dart';
import '../models/attendance_log_model.dart';
import 'dart:convert';

class AttendanceProvider {
  final StorageService _storageService = StorageService();

  Future<String?> _getToken() async {
    return await _storageService.getToken();
  }

  Future<CheckInResponse> checkIn({
    required XFile photo,
    required String latitude,
    required String longitude,
    String? deviceInfo,
  }) async {
    final token = await _getToken();
    final uri = Uri.parse('${ApiConsts.baseUrl}${ApiEndpoints.checkIn}');

    print('🔵 [AttendanceProvider] checkIn: Starting Request');
    print('   URL: $uri');
    print('   Latitude: $latitude, Longitude: $longitude');
    print('   DeviceInfo: $deviceInfo');

    var request = http.MultipartRequest('POST', uri);
    request.headers['Authorization'] = 'Bearer $token';

    request.fields['latitude'] = latitude;
    request.fields['longitude'] = longitude;
    if (deviceInfo != null) request.fields['deviceInfo'] = deviceInfo;

    final photoBytes = await photo.readAsBytes();
    request.files.add(
      http.MultipartFile.fromBytes(
        'photo',
        photoBytes,
        filename: 'photo.jpg',
        contentType: MediaType('image', 'jpeg'),
      ),
    );

    print('   Uploading photo: ${photo.path}');

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    print('🟣 [AttendanceProvider] checkIn: Response Received');
    print('   Status Code: ${response.statusCode}');
    print('   Body: ${response.body}');

    if (response.statusCode == 200 || response.statusCode == 201) {
      return CheckInResponse.fromJson(jsonDecode(response.body));
    } else {
      // Try to parse error message from response, else use generic
      try {
        final errorBody = jsonDecode(response.body);
        throw Exception(errorBody['message'] ?? 'Check-in failed');
      } catch (_) {
        throw Exception('Check-in failed: ${response.statusCode}');
      }
    }
  }

  Future<CheckOutResponse> checkOut({
    required String latitude,
    required String longitude,
    String? deviceInfo,
  }) async {
    final token = await _getToken();
    final uri = Uri.parse('${ApiConsts.baseUrl}${ApiEndpoints.checkOut}');

    // Assuming simple JSON body for checkout unless photo is added later
    // The requirement said photo is optional for checkout but disabled by default in Postman.
    // Implementing as multipart to support potential photo later or consistent with Postman body type "formdata"

    print('🔵 [CheckOut] Request Starting');
    print('   URL: $uri');
    print('   Latitude: $latitude, Longitude: $longitude');
    print('   DeviceInfo: $deviceInfo');

    var request = http.MultipartRequest('POST', uri);
    request.headers['Authorization'] = 'Bearer $token';

    request.fields['latitude'] = latitude;
    request.fields['longitude'] = longitude;
    if (deviceInfo != null) request.fields['deviceInfo'] = deviceInfo;

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    print('🟣 [CheckOut] Response Received');
    print('   Status Code: ${response.statusCode}');
    print('   Body: ${response.body}');

    if (response.statusCode == 200 || response.statusCode == 201) {
      return CheckOutResponse.fromJson(jsonDecode(response.body));
    } else {
      try {
        final errorBody = jsonDecode(response.body);
        throw Exception(errorBody['message'] ?? 'Check-out failed');
      } catch (_) {
        throw Exception('Check-out failed: ${response.statusCode}');
      }
    }
  }

  Future<AttendanceLogsResponse> getLogs({
    String? startDate,
    String? endDate,
  }) async {
    final token = await _getToken();
    var queryParams = <String, String>{};
    if (startDate != null) queryParams['startDate'] = startDate;
    if (endDate != null) queryParams['endDate'] = endDate;

    final uri = Uri.parse(
      '${ApiConsts.baseUrl}${ApiEndpoints.attendanceLogs}',
    ).replace(queryParameters: queryParams);

    final response = await http.get(
      uri,
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      print('🟣 [AttendanceProvider] getLogs: Response Received');
      print('   Body: ${response.body}');
      return AttendanceLogsResponse.fromJson(jsonDecode(response.body));
    } else {
      try {
        final errorBody = jsonDecode(response.body);
        throw Exception(errorBody['message'] ?? 'Failed to fetch logs');
      } catch (_) {
        throw Exception('Failed to fetch logs: ${response.statusCode}');
      }
    }
  }
}
