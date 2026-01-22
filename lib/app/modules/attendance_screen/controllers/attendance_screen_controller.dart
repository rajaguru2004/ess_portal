import 'package:get/get.dart';
import 'package:intl/intl.dart';
import '../../../data/sources/attendance_local_source.dart';
import '../../../data/models/attendance_response_model.dart';

class AttendanceScreenController extends GetxController {
  // Data source
  final attendanceLocalSource = AttendanceLocalSource();

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
      // Fetch attendance data from local source
      final attendanceResponse = await attendanceLocalSource
          .getAttendanceData();
      final data = attendanceResponse.data;

      // Update user info
      userName.value = data.user.name;
      employeeId.value = data.user.employeeId;

      // Update selected date
      selectedDateString.value = data.selectedDate;

      // Update shift
      currentShift.value = data.currentShift;

      // Update attendance stats
      final stats = data.attendanceStats;
      totalDays.value = stats.total;
      presentCount.value = stats.present.count;
      presentPercentage.value = stats.present.percentage;
      lateCount.value = stats.late.count;
      latePercentage.value = stats.late.percentage;
      absentCount.value = stats.absent.count;
      absentPercentage.value = stats.absent.percentage;
      leaveCount.value = stats.leave.count;
      leavePercentage.value = stats.leave.percentage;

      // Update employee details
      employeeDetails.value = data.employeeDetails;
    } catch (e) {
      print('Error loading attendance data: $e');
      Get.snackbar('Error', 'Failed to load attendance data');
    } finally {
      isLoading.value = false;
    }
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
