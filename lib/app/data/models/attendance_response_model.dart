import 'package:flutter/material.dart';

// Main response model
class AttendanceResponseModel {
  final String status;
  final String message;
  final AttendanceData data;

  AttendanceResponseModel({
    required this.status,
    required this.message,
    required this.data,
  });

  factory AttendanceResponseModel.fromJson(Map<String, dynamic> json) {
    return AttendanceResponseModel(
      status: json['status'] ?? '',
      message: json['message'] ?? '',
      data: AttendanceData.fromJson(json['data'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() {
    return {'status': status, 'message': message, 'data': data.toJson()};
  }
}

// Attendance data model
class AttendanceData {
  final UserInfo user;
  final String selectedDate;
  final String currentShift;
  final AttendanceStats attendanceStats;
  final List<EmployeeDetail> employeeDetails;

  AttendanceData({
    required this.user,
    required this.selectedDate,
    required this.currentShift,
    required this.attendanceStats,
    required this.employeeDetails,
  });

  factory AttendanceData.fromJson(Map<String, dynamic> json) {
    return AttendanceData(
      user: UserInfo.fromJson(json['user'] ?? {}),
      selectedDate: json['selectedDate'] ?? '',
      currentShift: json['currentShift'] ?? 'Morning Shift',
      attendanceStats: AttendanceStats.fromJson(json['attendanceStats'] ?? {}),
      employeeDetails:
          (json['employeeDetails'] as List?)
              ?.map((e) => EmployeeDetail.fromJson(e))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'user': user.toJson(),
      'selectedDate': selectedDate,
      'currentShift': currentShift,
      'attendanceStats': attendanceStats.toJson(),
      'employeeDetails': employeeDetails.map((e) => e.toJson()).toList(),
    };
  }
}

// User information model
class UserInfo {
  final String name;
  final String employeeId;

  UserInfo({required this.name, required this.employeeId});

  factory UserInfo.fromJson(Map<String, dynamic> json) {
    return UserInfo(
      name: json['name'] ?? '',
      employeeId: json['employeeId'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {'name': name, 'employeeId': employeeId};
  }
}

// Attendance statistics model
class AttendanceStats {
  final int total;
  final AttendanceStat present;
  final AttendanceStat late;
  final AttendanceStat absent;
  final AttendanceStat leave;

  AttendanceStats({
    required this.total,
    required this.present,
    required this.late,
    required this.absent,
    required this.leave,
  });

  factory AttendanceStats.fromJson(Map<String, dynamic> json) {
    return AttendanceStats(
      total: json['total'] ?? 0,
      present: AttendanceStat.fromJson(json['present'] ?? {}),
      late: AttendanceStat.fromJson(json['late'] ?? {}),
      absent: AttendanceStat.fromJson(json['absent'] ?? {}),
      leave: AttendanceStat.fromJson(json['leave'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'total': total,
      'present': present.toJson(),
      'late': late.toJson(),
      'absent': absent.toJson(),
      'leave': leave.toJson(),
    };
  }
}

// Individual attendance stat model
class AttendanceStat {
  final int count;
  final double percentage;

  AttendanceStat({required this.count, required this.percentage});

  factory AttendanceStat.fromJson(Map<String, dynamic> json) {
    return AttendanceStat(
      count: json['count'] ?? 0,
      percentage: (json['percentage'] ?? 0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {'count': count, 'percentage': percentage};
  }
}

// Employee detail model
class EmployeeDetail {
  final String id;
  final String name;
  final String initial;
  final String status;
  final String time;
  final String? checkInTime;
  final String? checkOutTime;
  final String statusColor;

  EmployeeDetail({
    required this.id,
    required this.name,
    required this.initial,
    required this.status,
    required this.time,
    this.checkInTime,
    this.checkOutTime,
    required this.statusColor,
  });

  factory EmployeeDetail.fromJson(Map<String, dynamic> json) {
    return EmployeeDetail(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      initial: json['initial'] ?? '',
      status: json['status'] ?? '',
      time: json['time'] ?? '',
      checkInTime: json['checkInTime'],
      checkOutTime: json['checkOutTime'],
      statusColor: json['statusColor'] ?? 'green',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'initial': initial,
      'status': status,
      'time': time,
      'checkInTime': checkInTime,
      'checkOutTime': checkOutTime,
      'statusColor': statusColor,
    };
  }

  Color get statusColorValue {
    switch (statusColor.toLowerCase()) {
      case 'green':
        return Colors.green;
      case 'red':
        return Colors.red;
      case 'orange':
        return Colors.orange;
      case 'blue':
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }
}
