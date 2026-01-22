/// User model representing employee information
class User {
  final String employeeId;
  final String name;
  final String role;

  User({required this.employeeId, required this.name, required this.role});

  /// Create User from JSON
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      employeeId: json['employeeId'] as String,
      name: json['name'] as String,
      role: json['role'] as String,
    );
  }

  /// Convert User to JSON
  Map<String, dynamic> toJson() {
    return {'employeeId': employeeId, 'name': name, 'role': role};
  }

  @override
  String toString() {
    return 'User(employeeId: $employeeId, name: $name, role: $role)';
  }
}
