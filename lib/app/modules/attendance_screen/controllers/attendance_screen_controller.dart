import 'package:get/get.dart';
import 'package:intl/intl.dart';
import '../../../data/providers/attendance_provider.dart';
import '../../../data/models/attendance_response_model.dart';

class AttendanceScreenController extends GetxController {
  // Data source
  final _attendanceProvider = AttendanceProvider();

  // Observable state variables
  final isLoading = true.obs;

  // User info
  final userName = ''.obs;
  final employeeId = ''.obs;

  // Date management
  final selectedDate = DateTime.now().obs;
  final selectedDateString = ''.obs;

  // Shift management
  final availableShifts = <String>[
    'Default Shift',
    'Morning Shift',
    'Evening Shift',
  ].obs;
  final currentShift = 'Morning Shift'.obs;

  // Attendance stats
  final totalDays = 0.obs;
  final presentCount = 0.obs;
  final presentPercentage = 0.0.obs;
  final lateCount = 0.obs;
  final latePercentage = 0.0.obs;
  final absentCount = 0.obs;
  final absentPercentage = 0.0.obs;
  final leaveCount = 0.obs;
  final leavePercentage = 0.0.obs;

  // Employee details
  final employeeDetails = <EmployeeDetail>[].obs;

  @override
  void onInit() {
    super.onInit();
    _initializeData();
  }

  Future<void> _initializeData() async {
    isLoading.value = true;

    try {
      // Fetch attendance data from provider
      // For now, fetching all logs without date filter or implementing pagination later
      // The API takes startDate and endDate, let's try to fetch for the current month or similar if needed.
      // But the UI seems to show daily data.
      // Let's assume we want to show stats for the current period.
      // The current UI logic seems to expect a single object with stats + details.
      // My new API returns a list of daily summaries.

      // We need to adapt the logic. The existing UI expects `AttendanceResponseModel`.
      // I have `AttendanceLogsResponse`.

      // Ideally I should refactor the UI to work with the new model, OR map the new model to the old structure if I want to minimize UI changes.
      // Given the instruction "connect with the backend", and the UI is "already done", I should probably try to keep the View as is if possible.

      // However, the `AttendanceResponseModel` and `AttendanceLogsResponse` are likely different.
      // Let's fetch the logs first.
      final response = await _attendanceProvider.getLogs();

      if (response.success && response.data != null) {
        final logs = response.data!;

        // Calculate stats
        int total = logs.length;
        int present = logs
            .where((l) => l.status == 'CHECKED_IN' || l.status == 'CHECKED_OUT')
            .length;
        int late = logs.where((l) => l.isLate).length;
        int absent = total - present; // Simplified logic
        int leave = 0; // Logic for leave not present in logs yet

        totalDays.value = total;
        presentCount.value = present;
        lateCount.value = late;
        absentCount.value = absent;
        leaveCount.value = leave;

        // Update percentages (basic calculation)
        if (total > 0) {
          presentPercentage.value = (present / total) * 100;
          latePercentage.value = (late / total) * 100;
          absentPercentage.value = (absent / total) * 100;
        }

        // Map logs to EmployeeDetail for UI
        employeeDetails.value = logs.map((log) {
          String timeStr = '-- : --';
          if (log.checkInAt != null) {
            timeStr = DateFormat('hh:mm a').format(log.checkInAt!);
            if (log.checkOutAt != null) {
              timeStr += ' - ${DateFormat('hh:mm a').format(log.checkOutAt!)}';
            }
          }

          return EmployeeDetail(
            id: log.id,
            name: DateFormat(
              'EEE, dd MMM',
            ).format(log.date), // Using date as name/title
            initial: DateFormat('d').format(log.date), // Day number as initial
            status: log.status.replaceAll('_', ' '),
            time: timeStr,
            statusColor: _getStatusColor(log.status),
          );
        }).toList();

        // Attempt to get user info from storage or use "User"
        // userName.value = ...
      }
    } catch (e) {
      print('Error loading attendance data: $e');
      Get.snackbar('Error', 'Failed to load attendance data');
    } finally {
      isLoading.value = false;
    }
  }

  String _getStatusColor(String status) {
    if (status == 'CHECKED_IN') return 'blue';
    if (status == 'CHECKED_OUT') return 'green';
    return 'red';
  }

  // Navigate to previous day
  void goToPreviousDay() {
    selectedDate.value = selectedDate.value.subtract(const Duration(days: 1));
    _updateDateString();
    // In a real app, you would fetch data for the new date here
  }

  // Navigate to next day
  void goToNextDay() {
    selectedDate.value = selectedDate.value.add(const Duration(days: 1));
    _updateDateString();
    // In a real app, you would fetch data for the new date here
  }

  // Update date string for display
  void _updateDateString() {
    selectedDateString.value = DateFormat(
      'dd MMMM yyyy',
    ).format(selectedDate.value);
  }

  // Select a shift
  void selectShift(String shift) {
    currentShift.value = shift;
    // In a real app, you would fetch data for the selected shift here
  }

  // Navigate to break hours screen
  void navigateToBreakHours() {
    Get.snackbar(
      'Break Hours',
      'Navigating to break hours details',
      snackPosition: SnackPosition.BOTTOM,
    );
  }
}
