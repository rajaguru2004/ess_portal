import 'dart:async';

/// Stub for non-web platforms. Should never be called.
Future<Map<String, dynamic>> webCheckInUpload({
  required String url,
  required String token,
  required List<int> photoBytes,
  required String filename,
  required String latitude,
  required String longitude,
  String? deviceInfo,
}) async {
  throw UnsupportedError('webCheckInUpload is only supported on web platform');
}
