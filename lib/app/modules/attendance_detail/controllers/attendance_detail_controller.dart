import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'dart:convert';
import 'package:flutter/services.dart';

class AttendanceDetailController extends GetxController {
  // Observable variables
  final isLoading = false.obs;
  final employeeName = ''.obs;
  final employeeId = ''.obs;
  final date = ''.obs;
  final status = 'full_day'.obs;

  // Punch entries
  final punchEntries = <PunchEntry>[].obs;

  // Summary
  final totalWorkingTime = ''.obs;
  final totalBreakTime = ''.obs;

  // Status options
  final statusOptions = <Map<String, String>>[].obs;

  @override
  void onInit() {
    super.onInit();
    loadAttendanceDetail();
  }

  Future<void> loadAttendanceDetail() async {
    try {
      isLoading.value = true;

      // Load from JSON file
      final String response = await rootBundle.loadString(
        'assets/data/attendance_detail_response.json',
      );
      final data = json.decode(response);

      if (data['status'] == 'success') {
        final responseData = data['data'];

        // Parse employee info
        employeeName.value = responseData['employee']['name'];
        employeeId.value = responseData['employee']['employeeId'];
        date.value = responseData['date'];
        status.value = responseData['status'];

        // Parse punch entries
        punchEntries.value = (responseData['punchEntries'] as List)
            .map((e) => PunchEntry.fromJson(e))
            .toList();

        // Parse summary
        final summary = responseData['summary'];
        totalWorkingTime.value = summary['totalWorkingTime'];
        totalBreakTime.value = summary['totalBreakTime'];

        // Parse status options
        statusOptions.value = (responseData['statusOptions'] as List)
            .map((e) => Map<String, String>.from(e))
            .toList();
      }
    } catch (e) {
      debugPrint('Error loading attendance detail: $e');
      Get.snackbar('Error', 'Failed to load attendance detail');
    } finally {
      isLoading.value = false;
    }
  }

  void changeStatus(String newStatus) {
    status.value = newStatus;
  }

  Future<void> editPunchTime(int index) async {
    final punchEntry = punchEntries[index];
    final currentTime = _parseTime(punchEntry.time);

    final TimeOfDay? pickedTime = await Get.dialog<TimeOfDay>(
      TimePickerDialog(initialTime: currentTime),
    );

    if (pickedTime != null) {
      // Update the time
      final newTime = _formatTime(pickedTime);
      punchEntries[index] = PunchEntry(
        id: punchEntry.id,
        type: punchEntry.type,
        time: newTime,
        timestamp: punchEntry.timestamp,
      );
      punchEntries.refresh();

      // Recalculate times (simplified - in real app, should call API)
      _recalculateSummary();
    }
  }

  TimeOfDay _parseTime(String timeStr) {
    try {
      // Parse time like "10:00 AM"
      final parts = timeStr.split(' ');
      final timeParts = parts[0].split(':');
      int hour = int.parse(timeParts[0]);
      final minute = int.parse(timeParts[1]);
      final isPM = parts.length > 1 && parts[1].toUpperCase() == 'PM';

      if (isPM && hour != 12) {
        hour += 12;
      } else if (!isPM && hour == 12) {
        hour = 0;
      }

      return TimeOfDay(hour: hour, minute: minute);
    } catch (e) {
      return TimeOfDay.now();
    }
  }

  String _formatTime(TimeOfDay time) {
    final hour = time.hourOfPeriod == 0 ? 12 : time.hourOfPeriod;
    final minute = time.minute.toString().padLeft(2, '0');
    final period = time.period == DayPeriod.am ? 'AM' : 'PM';
    return '$hour:$minute $period';
  }

  void _recalculateSummary() {
    // Simplified calculation - in real app, should call API
    // For now, just keep the existing values
    debugPrint('Recalculating summary...');
  }

  void saveChanges() {
    // TODO: Call API to save changes
    Get.snackbar(
      'Success',
      'Attendance details saved successfully',
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: Colors.green,
      colorText: Colors.white,
      duration: const Duration(seconds: 2),
    );
  }

  void cancel() {
    Get.back();
  }

  String get statusLabel {
    switch (status.value) {
      case 'full_day':
        return 'Full Day';
      case 'half_day':
        return 'Half Day';
      case 'absent':
        return 'Absent';
      default:
        return status.value;
    }
  }

  Color get statusColor {
    switch (status.value) {
      case 'full_day':
        return Colors.green;
      case 'half_day':
        return Colors.orange;
      case 'absent':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  String getBreakTime(int index) {
    if (index >= punchEntries.length - 1) return '';
    if (punchEntries[index].type != 'out') return '';
    if (punchEntries[index + 1].type != 'in') return '';

    // Simple break time calculation
    // In real app, this should come from API or proper calculation
    final breakTimes = ['30 Min', '21 Min'];
    final breakIndex = (index ~/ 2);
    if (breakIndex < breakTimes.length) {
      return breakTimes[breakIndex];
    }
    return '';
  }
}

class PunchEntry {
  final String id;
  final String type; // 'in' or 'out'
  final String time;
  final String timestamp;

  PunchEntry({
    required this.id,
    required this.type,
    required this.time,
    required this.timestamp,
  });

  factory PunchEntry.fromJson(Map<String, dynamic> json) {
    return PunchEntry(
      id: json['id'],
      type: json['type'],
      time: json['time'],
      timestamp: json['timestamp'],
    );
  }

  IconData get icon {
    return type == 'in' ? Icons.arrow_forward : Icons.arrow_back;
  }

  String get label {
    return type == 'in' ? 'In' : 'Out';
  }
}
