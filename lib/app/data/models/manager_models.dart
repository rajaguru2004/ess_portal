/// Manager-related data models for user management features

// ==================== User List Models ====================

class UserListResponse {
  final bool success;
  final String message;
  final List<UserItem> data;

  UserListResponse({
    required this.success,
    required this.message,
    required this.data,
  });

  factory UserListResponse.fromJson(Map<String, dynamic> json) {
    return UserListResponse(
      success: json['success'] as bool? ?? false,
      message: json['message'] as String? ?? '',
      data:
          (json['data'] as List<dynamic>?)
              ?.map((e) => UserItem.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}

class UserItem {
  final String id;
  final String employeeCode;
  final String username;
  final String fullName;
  final String? email;
  final String? mobile;
  final String tenantId;
  final String branchId;
  final String departmentId;
  final String roleId;
  final String? managerId;
  final bool isManager;
  final bool isHeadManager;
  final bool isActive;
  final String createdAt;
  final RoleInfo role;
  final ManagerInfo? manager;

  UserItem({
    required this.id,
    required this.employeeCode,
    required this.username,
    required this.fullName,
    this.email,
    this.mobile,
    required this.tenantId,
    required this.branchId,
    required this.departmentId,
    required this.roleId,
    this.managerId,
    required this.isManager,
    required this.isHeadManager,
    required this.isActive,
    required this.createdAt,
    required this.role,
    this.manager,
  });

  factory UserItem.fromJson(Map<String, dynamic> json) {
    return UserItem(
      id: json['id'] as String? ?? '',
      employeeCode: json['employeeCode'] as String? ?? '',
      username: json['username'] as String? ?? '',
      fullName: json['fullName'] as String? ?? '',
      email: json['email'] as String?,
      mobile: json['mobile'] as String?,
      tenantId: json['tenantId'] as String? ?? '',
      branchId: json['branchId'] as String? ?? '',
      departmentId: json['departmentId'] as String? ?? '',
      roleId: json['roleId'] as String? ?? '',
      managerId: json['managerId'] as String?,
      isManager: json['isManager'] as bool? ?? false,
      isHeadManager: json['isHeadManager'] as bool? ?? false,
      isActive: json['isActive'] as bool? ?? true,
      createdAt: json['createdAt'] as String? ?? '',
      role: RoleInfo.fromJson(json['Role'] as Map<String, dynamic>? ?? {}),
      manager: json['manager'] != null
          ? ManagerInfo.fromJson(json['manager'] as Map<String, dynamic>)
          : null,
    );
  }
}

class RoleInfo {
  final String id;
  final String name;
  final String code;
  final String description;

  RoleInfo({
    required this.id,
    required this.name,
    required this.code,
    required this.description,
  });

  factory RoleInfo.fromJson(Map<String, dynamic> json) {
    return RoleInfo(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      code: json['code'] as String? ?? '',
      description: json['description'] as String? ?? '',
    );
  }
}

class ManagerInfo {
  final String id;
  final String fullName;
  final String employeeCode;

  ManagerInfo({
    required this.id,
    required this.fullName,
    required this.employeeCode,
  });

  factory ManagerInfo.fromJson(Map<String, dynamic> json) {
    return ManagerInfo(
      id: json['id'] as String? ?? '',
      fullName: json['fullName'] as String? ?? '',
      employeeCode: json['employeeCode'] as String? ?? '',
    );
  }
}

// ==================== Manager Hierarchy Models ====================

class ManagerHierarchyResponse {
  final bool success;
  final String message;
  final List<ManagerItem> data;

  ManagerHierarchyResponse({
    required this.success,
    required this.message,
    required this.data,
  });

  factory ManagerHierarchyResponse.fromJson(Map<String, dynamic> json) {
    return ManagerHierarchyResponse(
      success: json['success'] as bool? ?? false,
      message: json['message'] as String? ?? '',
      data:
          (json['data'] as List<dynamic>?)
              ?.map((e) => ManagerItem.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}

class ManagerItem {
  final String id;
  final String employeeCode;
  final String fullName;
  final String email;
  final String? designation;
  final bool isHeadManager;
  final String departmentId;
  final String? managerId;
  final List<SubordinateInfo> subordinates;
  final ManagerInfo? manager;

  ManagerItem({
    required this.id,
    required this.employeeCode,
    required this.fullName,
    required this.email,
    this.designation,
    required this.isHeadManager,
    required this.departmentId,
    this.managerId,
    required this.subordinates,
    this.manager,
  });

  factory ManagerItem.fromJson(Map<String, dynamic> json) {
    return ManagerItem(
      id: json['id'] as String? ?? '',
      employeeCode: json['employeeCode'] as String? ?? '',
      fullName: json['fullName'] as String? ?? '',
      email: json['email'] as String? ?? '',
      designation: json['designation'] as String?,
      isHeadManager: json['isHeadManager'] as bool? ?? false,
      departmentId: json['departmentId'] as String? ?? '',
      managerId: json['managerId'] as String?,
      subordinates:
          (json['subordinates'] as List<dynamic>?)
              ?.map((e) => SubordinateInfo.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      manager: json['manager'] != null
          ? ManagerInfo.fromJson(json['manager'] as Map<String, dynamic>)
          : null,
    );
  }
}

class SubordinateInfo {
  final String id;
  final String fullName;
  final String employeeCode;
  final String? designation;
  final bool isHeadManager;

  SubordinateInfo({
    required this.id,
    required this.fullName,
    required this.employeeCode,
    this.designation,
    required this.isHeadManager,
  });

  factory SubordinateInfo.fromJson(Map<String, dynamic> json) {
    return SubordinateInfo(
      id: json['id'] as String? ?? '',
      fullName: json['fullName'] as String? ?? '',
      employeeCode: json['employeeCode'] as String? ?? '',
      designation: json['designation'] as String?,
      isHeadManager: json['isHeadManager'] as bool? ?? false,
    );
  }
}

// ==================== Make Manager Models ====================

class MakeManagerResponse {
  final bool success;
  final String message;
  final MakeManagerData? data;

  MakeManagerResponse({
    required this.success,
    required this.message,
    this.data,
  });

  factory MakeManagerResponse.fromJson(Map<String, dynamic> json) {
    return MakeManagerResponse(
      success: json['success'] as bool? ?? false,
      message: json['message'] as String? ?? '',
      data: json['data'] != null
          ? MakeManagerData.fromJson(json['data'] as Map<String, dynamic>)
          : null,
    );
  }
}

class MakeManagerData {
  final String id;
  final String employeeCode;
  final String fullName;
  final String email;
  final bool isHeadManager;
  final String? managerId;
  final ManagerInfo? manager;

  MakeManagerData({
    required this.id,
    required this.employeeCode,
    required this.fullName,
    required this.email,
    required this.isHeadManager,
    this.managerId,
    this.manager,
  });

  factory MakeManagerData.fromJson(Map<String, dynamic> json) {
    return MakeManagerData(
      id: json['id'] as String? ?? '',
      employeeCode: json['employeeCode'] as String? ?? '',
      fullName: json['fullName'] as String? ?? '',
      email: json['email'] as String? ?? '',
      isHeadManager: json['isHeadManager'] as bool? ?? false,
      managerId: json['managerId'] as String?,
      manager: json['manager'] != null
          ? ManagerInfo.fromJson(json['manager'] as Map<String, dynamic>)
          : null,
    );
  }
}

// ==================== Assign Manager Models ====================

class AssignManagerResponse {
  final bool success;
  final String message;
  final AssignManagerData? data;

  AssignManagerResponse({
    required this.success,
    required this.message,
    this.data,
  });

  factory AssignManagerResponse.fromJson(Map<String, dynamic> json) {
    return AssignManagerResponse(
      success: json['success'] as bool? ?? false,
      message: json['message'] as String? ?? '',
      data: json['data'] != null
          ? AssignManagerData.fromJson(json['data'] as Map<String, dynamic>)
          : null,
    );
  }
}

class AssignManagerData {
  final String id;
  final String employeeCode;
  final String fullName;
  final String email;
  final String managerId;
  final ManagerInfo manager;

  AssignManagerData({
    required this.id,
    required this.employeeCode,
    required this.fullName,
    required this.email,
    required this.managerId,
    required this.manager,
  });

  factory AssignManagerData.fromJson(Map<String, dynamic> json) {
    return AssignManagerData(
      id: json['id'] as String? ?? '',
      employeeCode: json['employeeCode'] as String? ?? '',
      fullName: json['fullName'] as String? ?? '',
      email: json['email'] as String? ?? '',
      managerId: json['managerId'] as String? ?? '',
      manager: ManagerInfo.fromJson(
        json['manager'] as Map<String, dynamic>? ?? {},
      ),
    );
  }
}

// ==================== User Hierarchy Models ====================

class UserHierarchyResponse {
  final bool success;
  final String message;
  final HierarchyData? data;

  UserHierarchyResponse({
    required this.success,
    required this.message,
    this.data,
  });

  factory UserHierarchyResponse.fromJson(Map<String, dynamic> json) {
    return UserHierarchyResponse(
      success: json['success'] as bool? ?? false,
      message: json['message'] as String? ?? '',
      data: json['data'] != null
          ? HierarchyData.fromJson(json['data'] as Map<String, dynamic>)
          : null,
    );
  }
}

class HierarchyData {
  final String id;
  final String employeeCode;
  final String fullName;
  final String email;
  final bool isHeadManager;
  final String? managerId;
  final ManagerInfo? manager;
  final List<SubordinateInfo> subordinates;

  HierarchyData({
    required this.id,
    required this.employeeCode,
    required this.fullName,
    required this.email,
    required this.isHeadManager,
    this.managerId,
    this.manager,
    required this.subordinates,
  });

  factory HierarchyData.fromJson(Map<String, dynamic> json) {
    return HierarchyData(
      id: json['id'] as String? ?? '',
      employeeCode: json['employeeCode'] as String? ?? '',
      fullName: json['fullName'] as String? ?? '',
      email: json['email'] as String? ?? '',
      isHeadManager: json['isHeadManager'] as bool? ?? false,
      managerId: json['managerId'] as String?,
      manager: json['manager'] != null
          ? ManagerInfo.fromJson(json['manager'] as Map<String, dynamic>)
          : null,
      subordinates:
          (json['subordinates'] as List<dynamic>?)
              ?.map((e) => SubordinateInfo.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}
