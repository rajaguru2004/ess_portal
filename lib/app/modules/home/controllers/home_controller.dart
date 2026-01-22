import 'dart:async';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/sources/home_local_source.dart';

class HomeController extends GetxController {
  // Data source
  final homeLocalSource = HomeLocalSource();

  // Observable state variables
  final isLoading = true.obs;

  // Timer for working hours
  final workingHours = 0.obs;
  final workingMinutes = 0.obs;
  final workingSeconds = 0.obs;

  // Timer instance
  Timer? _timer;

  // Shift information
  final shiftStart = ''.obs;
  final shiftEnd = ''.obs;
  final shiftOvertime = ''.obs;

  // Break time
  final totalBreakHours = 0.obs;
  final totalBreakMinutes = 0.obs;

  // Activity list
  final activities = <Map<String, dynamic>>[].obs;

  // User information
  final userName = ''.obs;
  final currentDate = ''.obs;

  @override
  void onInit() {
    super.onInit();
    _initializeData();
  }

  @override
  void onClose() {
    _timer?.cancel();
    super.onClose();
  }

  Future<void> _initializeData() async {
    isLoading.value = true;

    // Set current date
    final now = DateTime.now();
    final months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    currentDate.value = '${now.day} ${months[now.month - 1]} ${now.year}';

    try {
      // Fetch data from local source
      final homeResponse = await homeLocalSource.getHomeData();
      final data = homeResponse.data;

      // Update User Info
      userName.value = data.user.name;

      // Update Shift Info
      shiftStart.value = data.shift.startTime;
      shiftEnd.value = data.shift.endTime;
      shiftOvertime.value = data.shift.overtime;

      // Update Attendance Info
      workingHours.value = data.attendance.workingHours.hours;
      workingMinutes.value = data.attendance.workingHours.minutes;
      workingSeconds.value = data.attendance.workingHours.seconds;

      totalBreakHours.value = data.attendance.totalBreakTime.hours;
      totalBreakMinutes.value = data.attendance.totalBreakTime.minutes;

      // Update Activities
      activities.value = data.activities.map((activity) {
        return {
          'type': activity.type,
          'time': activity.time ?? '',
          'duration': activity.duration ?? '',
          'isBreak': activity.isBreak,
          'icon': _getIconForActivityType(activity.type),
          'color': _getColorForActivityType(activity.type),
        };
      }).toList();

      // Start the timer after data is loaded
      _startWorkingTimer();
    } catch (e) {
      print('Error loading home data: $e');
      Get.snackbar('Error', 'Failed to load dashboard data');
    } finally {
      isLoading.value = false;
    }
  }

  IconData _getIconForActivityType(String type) {
    if (type.toLowerCase().contains('in')) return Icons.login;
    if (type.toLowerCase().contains('out')) return Icons.logout;
    return Icons.coffee; // Default for break
  }

  Color _getColorForActivityType(String type) {
    if (type.toLowerCase().contains('in')) return Colors.green;
    if (type.toLowerCase().contains('out')) return Colors.red;
    if (type.toLowerCase().contains('break')) return Colors.orange;
    return Colors.grey;
  }

  void _startWorkingTimer() {
    _timer?.cancel(); // Cancel existing timer if any
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      workingSeconds.value++;

      if (workingSeconds.value >= 60) {
        workingSeconds.value = 0;
        workingMinutes.value++;
      }

      if (workingMinutes.value >= 60) {
        workingMinutes.value = 0;
        workingHours.value++;
      }
    });
  }

  void handleSwipeToPunch() {
    // Handle punch action
    Get.snackbar(
      'Punch Action',
      'Swipe to punch feature',
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: Get.theme.colorScheme.primary,
      colorText: Colors.white,
      duration: const Duration(seconds: 2),
    );
  }
}
