// ignore: avoid_web_libraries_in_flutter
import 'dart:html' as html;
import 'dart:async';

/// Uploads attendance check-in using dart:html XMLHttpRequest / FormData.
/// This is needed for iOS Safari compatibility — the `http` package's
/// BrowserClient does not reliably handle multipart uploads on iOS Safari.
Future<Map<String, dynamic>> webCheckInUpload({
  required String url,
  required String token,
  required List<int> photoBytes,
  required String filename,
  required String latitude,
  required String longitude,
  String? deviceInfo,
}) async {
  final completer = Completer<Map<String, dynamic>>();

  // Build a Blob from the photo bytes
  final blob = html.Blob([photoBytes], 'image/jpeg');

  // Build FormData
  final formData = html.FormData();
  formData.appendBlob('photo', blob, filename);
  formData.append('latitude', latitude);
  formData.append('longitude', longitude);
  if (deviceInfo != null) {
    formData.append('deviceInfo', deviceInfo);
  }

  // Create XHR
  final xhr = html.HttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('Authorization', 'Bearer $token');
  // Do NOT set Content-Type manually — the browser sets it including boundary

  xhr.onLoad.listen((_) {
    final status = xhr.status ?? 0;
    final body = xhr.responseText ?? '';
    completer.complete({'statusCode': status, 'body': body});
  });

  xhr.onError.listen((_) {
    completer.completeError(
      Exception('XHR network error (status: ${xhr.status}): ${xhr.statusText}'),
    );
  });

  xhr.onAbort.listen((_) {
    completer.completeError(Exception('XHR request aborted'));
  });

  xhr.send(formData);
  return completer.future;
}
