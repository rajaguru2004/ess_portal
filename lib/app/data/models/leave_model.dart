class LeaveType {
  final String id;
  final String? tenantId;
  final String name;
  final String code;
  final int? defaultDays;
  final bool? carryForwardAllowed;
  final int? maxCarryForward;
  final bool? encashmentAllowed;
  final bool? isActive;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  LeaveType({
    required this.id,
    this.tenantId,
    required this.name,
    required this.code,
    this.defaultDays,
    this.carryForwardAllowed,
    this.maxCarryForward,
    this.encashmentAllowed,
    this.isActive,
    this.createdAt,
    this.updatedAt,
  });

  factory LeaveType.fromJson(Map<String, dynamic> json) {
    return LeaveType(
      id: json['id'],
      tenantId: json['tenantId'],
      name: json['name'],
      code: json['code'],
      defaultDays: json['defaultDays'],
      carryForwardAllowed: json['carryForwardAllowed'],
      maxCarryForward: json['maxCarryForward'],
      encashmentAllowed: json['encashmentAllowed'],
      isActive: json['isActive'],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'])
          : null,
    );
  }
}

class LeaveBalance {
  final String leaveTypeId;
  final LeaveType leaveType;
  final double allocated;
  final double carryForward;
  final double used;
  final double pending;
  final double available;

  LeaveBalance({
    required this.leaveTypeId,
    required this.leaveType,
    required this.allocated,
    required this.carryForward,
    required this.used,
    required this.pending,
    required this.available,
  });

  factory LeaveBalance.fromJson(Map<String, dynamic> json) {
    return LeaveBalance(
      leaveTypeId: json['leaveTypeId'],
      leaveType: LeaveType.fromJson(json['leaveType']),
      allocated: (json['allocated'] as num).toDouble(),
      carryForward: (json['carryForward'] as num).toDouble(),
      used: (json['used'] as num).toDouble(),
      pending: (json['pending'] as num).toDouble(),
      available: (json['available'] as num).toDouble(),
    );
  }
}

class LeaveApplication {
  final String id;
  final String userId;
  final String leaveTypeId;
  final DateTime startDate;
  final DateTime endDate;
  final String? halfDayType;
  final double totalDays;
  final String reason;
  final int year;
  final String status;
  final DateTime appliedAt;
  final String? approvedBy;
  final DateTime? approvedAt;
  final String? rejectedBy;
  final DateTime? rejectedAt;
  final String? rejectionReason;
  final DateTime? cancelledAt;
  final String? cancelledBy;
  final DateTime createdAt;
  final DateTime updatedAt;
  final LeaveType? leaveType;
  final UserSummary? user;

  LeaveApplication({
    required this.id,
    required this.userId,
    required this.leaveTypeId,
    required this.startDate,
    required this.endDate,
    this.halfDayType,
    required this.totalDays,
    required this.reason,
    required this.year,
    required this.status,
    required this.appliedAt,
    this.approvedBy,
    this.approvedAt,
    this.rejectedBy,
    this.rejectedAt,
    this.rejectionReason,
    this.cancelledAt,
    this.cancelledBy,
    required this.createdAt,
    required this.updatedAt,
    this.leaveType,
    this.user,
  });

  factory LeaveApplication.fromJson(Map<String, dynamic> json) {
    return LeaveApplication(
      id: json['id'],
      userId: json['userId'],
      leaveTypeId: json['leaveTypeId'],
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      halfDayType: json['halfDayType'],
      totalDays: (json['totalDays'] as num).toDouble(),
      reason: json['reason'],
      year: json['year'],
      status: json['status'],
      appliedAt: DateTime.parse(json['appliedAt']),
      approvedBy: json['approvedBy'],
      approvedAt: json['approvedAt'] != null
          ? DateTime.parse(json['approvedAt'])
          : null,
      rejectedBy: json['rejectedBy'],
      rejectedAt: json['rejectedAt'] != null
          ? DateTime.parse(json['rejectedAt'])
          : null,
      rejectionReason: json['rejectionReason'],
      cancelledAt: json['cancelledAt'] != null
          ? DateTime.parse(json['cancelledAt'])
          : null,
      cancelledBy: json['cancelledBy'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      leaveType: json['leaveType'] != null
          ? LeaveType.fromJson(json['leaveType'])
          : null,
      user: json['user'] != null ? UserSummary.fromJson(json['user']) : null,
    );
  }
}

class UserSummary {
  final String id;
  final String fullName;
  final String employeeCode;

  UserSummary({
    required this.id,
    required this.fullName,
    required this.employeeCode,
  });

  factory UserSummary.fromJson(Map<String, dynamic> json) {
    return UserSummary(
      id: json['id'],
      fullName: json['fullName'],
      employeeCode: json['employeeCode'],
    );
  }
}

class LeaveBalanceResponse {
  final bool success;
  final String message;
  final List<LeaveBalance> data;

  LeaveBalanceResponse({
    required this.success,
    required this.message,
    required this.data,
  });

  factory LeaveBalanceResponse.fromJson(Map<String, dynamic> json) {
    return LeaveBalanceResponse(
      success: json['success'],
      message: json['message'],
      data: (json['data'] as List)
          .map((i) => LeaveBalance.fromJson(i))
          .toList(),
    );
  }
}

class MyLeavesResponse {
  final bool success;
  final String message;
  final List<LeaveApplication> data;

  MyLeavesResponse({
    required this.success,
    required this.message,
    required this.data,
  });

  factory MyLeavesResponse.fromJson(Map<String, dynamic> json) {
    return MyLeavesResponse(
      success: json['success'],
      message: json['message'],
      data: (json['data'] as List)
          .map((i) => LeaveApplication.fromJson(i))
          .toList(),
    );
  }
}

class ApplyLeaveResponse {
  final bool success;
  final String message;
  final LeaveApplication data;

  ApplyLeaveResponse({
    required this.success,
    required this.message,
    required this.data,
  });

  factory ApplyLeaveResponse.fromJson(Map<String, dynamic> json) {
    return ApplyLeaveResponse(
      success: json['success'],
      message: json['message'],
      data: LeaveApplication.fromJson(json['data']),
    );
  }
}
