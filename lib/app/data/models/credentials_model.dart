/// Credentials model representing login credentials
class Credentials {
  final String username;
  final String password;

  Credentials({required this.username, required this.password});

  /// Create Credentials from JSON
  factory Credentials.fromJson(Map<String, dynamic> json) {
    return Credentials(
      username: json['username'] as String,
      password: json['password'] as String,
    );
  }

  /// Convert Credentials to JSON
  Map<String, dynamic> toJson() {
    return {'username': username, 'password': password};
  }

  @override
  String toString() {
    return 'Credentials(username: $username)';
  }
}
