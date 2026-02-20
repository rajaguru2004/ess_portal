import 'package:camera/camera.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import '../consts/api_consts.dart';
import '../services/storage_service.dart';
import '../models/attendance_models.dart';
import '../models/attendance_log_model.dart';
import 'dart:convert';
// Conditional import: uses dart:html on web, stub on other platforms
import 'web_upload_helper_stub.dart'
    if (dart.library.html) 'web_upload_helper.dart';

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
    final url = '${ApiConsts.baseUrl}${ApiEndpoints.checkIn}';
    final uri = Uri.parse(url);

    print('🔵 [AttendanceProvider] checkIn: Starting Request');
    print('   URL: $uri');
    print('   Latitude: $latitude, Longitude: $longitude');
    print('   DeviceInfo: $deviceInfo');
    print('   Platform: ${kIsWeb ? "Web" : "Native"}');

    // Read photo bytes first (works on all platforms including web blob URLs)
    final photoBytes = await photo.readAsBytes();
    print('   Photo bytes read: ${photoBytes.length} bytes');

    int statusCode;
    String responseBody;

    if (kIsWeb) {
      // ── Web (including iOS Safari) ──────────────────────────────────────
      // Use dart:html FormData + XHR instead of http.MultipartRequest.
      // The http package's BrowserClient fails silently on iOS Safari when
      // sending multipart/form-data with blob-backed XFile bytes.
      print('   Using web-native XHR upload (iOS Safari safe)');
      final result = await webCheckInUpload(
        url: url,
        token: token ?? '',
        photoBytes: photoBytes,
        filename: 'photo.jpg',
        latitude: latitude,
        longitude: longitude,
        deviceInfo: deviceInfo,
      );
      statusCode = result['statusCode'] as int;
      responseBody = result['body'] as String;
    } else {
      // ── Native (Android / iOS app / desktop) ──────────────────────────
      var request = http.MultipartRequest('POST', uri);
      request.headers['Authorization'] = 'Bearer $token';
      request.fields['latitude'] = latitude;
      request.fields['longitude'] = longitude;
      if (deviceInfo != null) request.fields['deviceInfo'] = deviceInfo;
      request.files.add(
        http.MultipartFile.fromBytes(
          'photo',
          photoBytes,
          filename: 'photo.jpg',
          contentType: MediaType('image', 'jpeg'),
        ),
      );
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);
      statusCode = response.statusCode;
      responseBody = response.body;
    }

    print('🟣 [AttendanceProvider] checkIn: Response Received');
    print('   Status Code: $statusCode');
    print('   Body: $responseBody');

    if (statusCode == 200 || statusCode == 201) {
      return CheckInResponse.fromJson(jsonDecode(responseBody));
    } else {
      // Always include status code + raw body so the UI snackbar shows exactly
      // what the server returned — critical for debugging iOS Safari issues.
      String serverMessage;
      try {
        final errorBody = jsonDecode(responseBody) as Map<String, dynamic>;
        serverMessage = errorBody['message']?.toString() ?? 'Check-in failed';
      } catch (_) {
        serverMessage = 'Check-in failed';
      }
      throw Exception('[$statusCode] $serverMessage | raw: $responseBody');
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
      // Always include status code + raw body so the UI snackbar shows exactly
      // what the server returned — critical for debugging iOS Safari issues.
      String serverMessage;
      try {
        final errorBody = jsonDecode(response.body) as Map<String, dynamic>;
        serverMessage = errorBody['message']?.toString() ?? 'Check-out failed';
      } catch (_) {
        serverMessage = 'Check-out failed';
      }
      throw Exception(
        '[$response.statusCode] $serverMessage | raw: ${response.body}',
      );
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
