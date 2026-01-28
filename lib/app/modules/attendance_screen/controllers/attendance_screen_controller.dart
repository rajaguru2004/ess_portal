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
    refreshData();
  }

  Future<void> refreshData() async {
    isLoading.value = true;

    try {
      // Fetch attendance data for the current month
      final now = DateTime.now();
      final startDate = DateTime(now.year, now.month, 1);
      final endDate = DateTime(
        now.year,
        now.month + 1,
        0,
      ); // Last day of current month

      final startStr =
          '${startDate.year}-${startDate.month.toString().padLeft(2, '0')}-${startDate.day.toString().padLeft(2, '0')}';
      final endStr =
          '${endDate.year}-${endDate.month.toString().padLeft(2, '0')}-${endDate.day.toString().padLeft(2, '0')}';

      print(
        '🔵 [AttendanceScreenController] Fetching logs from $startStr to $endStr',
      );

      final response = await _attendanceProvider.getLogs(
        startDate: startStr,
        endDate: endStr,
      );

      print(
        '🟢 [AttendanceScreenController] Response success: ${response.success}',
      );

      if (response.success && response.data != null) {
        final logs = response.data!;

        // Calculate stats
        int total = logs.length; // Total days with records
        int present = logs
            .where((l) => l.status == 'CHECKED_IN' || l.status == 'CHECKED_OUT')
            .length;
        int late = logs.where((l) => l.isLate).length;
        // Absent logic: This usually requires knowing total working days in month vs present.
        // For now, let's assume specific "ABSENT" status logs exist OR we calculate based on past days without logs?
        // Simple logic given the API: Absent count from logs with status 'ABSENT' if any, or 0.
        // User JSON doesn't show ABSENT logs, only existing ones.
        // We'll trust the stats calculation relative to retrieved logs.
        int absent = logs.where((l) => l.status == 'ABSENT').length;

        // If "total" means working days passed, we can't know that from just logs.
        // But for the donut chart, "Total" usually splits into Present/Absent/Leave.
        // If we only have logs for days present, Absent will be 0.
        // Let's stick to counting explicit statuses if available.
        // If only Present logs exist, Absent=0 is technically correct for "Logs Retrieved".

        int leave = logs.where((l) => l.status == 'LEAVE').length;

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
          String? checkInStr;
          String? checkOutStr;

          if (log.checkInAt != null) {
            checkInStr = DateFormat('hh:mm a').format(log.checkInAt!);
            timeStr = checkInStr;
            if (log.checkOutAt != null) {
              checkOutStr = DateFormat('hh:mm a').format(log.checkOutAt!);
              timeStr += ' - $checkOutStr';
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
            checkInTime: checkInStr,
            checkOutTime: checkOutStr,
            statusColor: _getStatusColor(log.status),
          );
        }).toList();

        print(
          '✅ [AttendanceScreenController] Processed ${employeeDetails.length} log entries',
        );

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
