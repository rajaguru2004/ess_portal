class AttendanceLogsResponse {
  bool success;
  String message;
  List<AttendanceDailySummary>? data;

  AttendanceLogsResponse({
    required this.success,
    required this.message,
    this.data,
  });

  factory AttendanceLogsResponse.fromJson(Map<String, dynamic> json) {
    return AttendanceLogsResponse(
      success: json['success'],
      message: json['message'],
      data: json['data'] != null
          ? (json['data'] as List)
                .map((i) => AttendanceDailySummary.fromJson(i))
                .toList()
          : null,
    );
  }
}

class AttendanceDailySummary {
  String id;
  String userId;
  DateTime date;
  DateTime? checkInAt;
  DateTime? checkOutAt;
  String status;
  int workMinutes;
  bool isLate;
  bool geoMismatch;
  List<AttendanceLog>? logs;

  AttendanceDailySummary({
    required this.id,
    required this.userId,
    required this.date,
    this.checkInAt,
    this.checkOutAt,
    required this.status,
    required this.workMinutes,
    required this.isLate,
    required this.geoMismatch,
    this.logs,
  });

  factory AttendanceDailySummary.fromJson(Map<String, dynamic> json) {
    return AttendanceDailySummary(
      id: json['id'],
      userId: json['userId'],
      date: DateTime.parse(json['date']),
      checkInAt: json['checkInAt'] != null
          ? DateTime.parse(json['checkInAt'])
          : null,
      checkOutAt: json['checkOutAt'] != null
          ? DateTime.parse(json['checkOutAt'])
          : null,
      status: json['status'],
      workMinutes: json['workMinutes'] ?? 0,
      isLate: json['isLate'] ?? false,
      geoMismatch: json['geoMismatch'] ?? false,
      logs: json['logs'] != null
          ? (json['logs'] as List)
                .map((i) => AttendanceLog.fromJson(i))
                .toList()
          : null,
    );
  }
}

class AttendanceLog {
  String id;
  String type; // IN or OUT
  DateTime timestamp;
  String? photoUrl;
  String? latitude;
  String? longitude;
  String? deviceInfo;

  AttendanceLog({
    required this.id,
    required this.type,
    required this.timestamp,
    this.photoUrl,
    this.latitude,
    this.longitude,
    this.deviceInfo,
  });

  factory AttendanceLog.fromJson(Map<String, dynamic> json) {
    return AttendanceLog(
      id: json['id'],
      type: json['type'],
      timestamp: DateTime.parse(json['timestamp']),
      photoUrl: json['photoUrl'],
      latitude: json['latitude'],
      longitude: json['longitude'],
      deviceInfo: json['deviceInfo'],
    );
  }
}
