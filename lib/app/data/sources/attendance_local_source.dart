import 'dart:convert';
import 'package:flutter/services.dart';
import '../models/attendance_response_model.dart';

class AttendanceLocalSource {
  Future<AttendanceResponseModel> getAttendanceData() async {
    try {
      // Load the JSON file from assets
      final String jsonString = await rootBundle.loadString(
        'assets/data/attendance_response.json',
      );

      // Parse JSON string
      final Map<String, dynamic> jsonData = json.decode(jsonString);

      // Convert to model
      return AttendanceResponseModel.fromJson(jsonData);
    } catch (e) {
      throw Exception('Failed to load attendance data: $e');
    }
  }
}
