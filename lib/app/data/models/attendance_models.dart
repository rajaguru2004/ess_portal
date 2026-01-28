class CheckInResponse {
  bool success;
  String message;
  CheckInData? data;

  CheckInResponse({required this.success, required this.message, this.data});

  factory CheckInResponse.fromJson(Map<String, dynamic> json) {
    return CheckInResponse(
      success: json['success'],
      message: json['message'],
      data: json['data'] != null ? CheckInData.fromJson(json['data']) : null,
    );
  }
}

class CheckInData {
  String attendanceId;
  String status;
  DateTime checkInAt;
  bool isLate;
  bool geoMismatch;

  CheckInData({
    required this.attendanceId,
    required this.status,
    required this.checkInAt,
    required this.isLate,
    required this.geoMismatch,
  });

  factory CheckInData.fromJson(Map<String, dynamic> json) {
    return CheckInData(
      attendanceId: json['attendanceId'],
      status: json['status'],
      checkInAt: DateTime.parse(json['checkInAt']),
      isLate: json['isLate'],
      geoMismatch: json['geoMismatch'],
    );
  }
}

class CheckOutResponse {
  bool success;
  String message;
  CheckOutData? data;

  CheckOutResponse({required this.success, required this.message, this.data});

  factory CheckOutResponse.fromJson(Map<String, dynamic> json) {
    return CheckOutResponse(
      success: json['success'],
      message: json['message'],
      data: json['data'] != null ? CheckOutData.fromJson(json['data']) : null,
    );
  }
}

class CheckOutData {
  String attendanceId;
  String status;
  DateTime checkOutAt;
  int workMinutes;

  CheckOutData({
    required this.attendanceId,
    required this.status,
    required this.checkOutAt,
    required this.workMinutes,
  });

  factory CheckOutData.fromJson(Map<String, dynamic> json) {
    return CheckOutData(
      attendanceId: json['attendanceId'],
      status: json['status'],
      checkOutAt: DateTime.parse(json['checkOutAt']),
      workMinutes: json['workMinutes'],
    );
  }
}
