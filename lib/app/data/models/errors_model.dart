/// Errors model representing error messages
class Errors {
  final String invalid;
  final String empty;

  Errors({required this.invalid, required this.empty});

  /// Create Errors from JSON
  factory Errors.fromJson(Map<String, dynamic> json) {
    return Errors(
      invalid: json['invalid'] as String,
      empty: json['empty'] as String,
    );
  }

  /// Convert Errors to JSON
  Map<String, dynamic> toJson() {
    return {'invalid': invalid, 'empty': empty};
  }

  @override
  String toString() {
    return 'Errors(invalid: $invalid, empty: $empty)';
  }
}
