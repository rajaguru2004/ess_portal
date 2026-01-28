/// User model representing employee information
class User {
  final String id;
  final String employeeCode;
  final String username;
  final String fullName;
  final String roleId;
  final String tenantId;
  final bool firstLogin;

  User({
    required this.id,
    required this.employeeCode,
    required this.username,
    required this.fullName,
    required this.roleId,
    required this.tenantId,
    required this.firstLogin,
  });

  /// Create User from JSON
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String? ?? '',
      employeeCode: json['employeeCode'] as String? ?? '',
      username: json['username'] as String? ?? '',
      fullName: json['fullName'] as String? ?? '',
      roleId: json['roleId'] as String? ?? '',
      tenantId: json['tenantId'] as String? ?? '',
      firstLogin: json['firstLogin'] as bool? ?? false,
    );
  }

  /// Convert User to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'employeeCode': employeeCode,
      'username': username,
      'fullName': fullName,
      'roleId': roleId,
      'tenantId': tenantId,
      'firstLogin': firstLogin,
    };
  }

  @override
  String toString() {
    return 'User(id: $id, employeeCode: $employeeCode, fullName: $fullName)';
  }
}
