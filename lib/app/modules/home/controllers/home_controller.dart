import 'dart:async';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:geolocator/geolocator.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'dart:io';
import '../../../data/sources/home_local_source.dart';
import '../../../data/providers/attendance_provider.dart';
import '../widgets/change_password_dialog.dart';
import '../../../data/services/storage_service.dart';

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

  // Real State
  final isCheckedIn = false.obs;
  // Provider
  final _attendanceProvider = AttendanceProvider();

  // User information
  final userName = ''.obs;
  final currentDate = ''.obs;

  @override
  void onInit() {
    super.onInit();
    _initializeData();

    // Check for first login
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (Get.arguments != null && Get.arguments is Map) {
        final args = Get.arguments as Map;
        if (args['firstLogin'] == true) {
          _showChangePasswordDialog();
        }
      }
    });
  }

  void _showChangePasswordDialog() {
    Get.dialog(const ChangePasswordDialog(), barrierDismissible: false);
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
      // Fetch data from local source (for layout items)
      final homeResponse = await homeLocalSource.getHomeData();
      final data = homeResponse.data;

      // Update User Info
      final user = await StorageService().getUser();
      if (user != null) {
        userName.value = user.fullName;
      } else {
        userName.value = data.user.name;
      }

      // Update Shift Info
      shiftStart.value = data.shift.startTime;
      shiftEnd.value = data.shift.endTime;
      shiftOvertime.value = data.shift.overtime;

      // Fetch Real Attendance Status
      final nowStr =
          '${DateTime.now().year}-${DateTime.now().month.toString().padLeft(2, '0')}-${DateTime.now().day.toString().padLeft(2, '0')}';
      final attendanceResponse = await _attendanceProvider.getLogs(
        startDate: nowStr,
        endDate: nowStr,
      );

      if (attendanceResponse.success &&
          attendanceResponse.data != null &&
          attendanceResponse.data!.isNotEmpty) {
        final todayLog = attendanceResponse.data!.first;

        // Determine logical state
        if (todayLog.status == 'CHECKED_IN') {
          isCheckedIn.value = true;
          // Calculate elapsed time from checkInAt
          if (todayLog.checkInAt != null) {
            final duration = DateTime.now().difference(todayLog.checkInAt!);
            workingHours.value = duration.inHours;
            workingMinutes.value = duration.inMinutes % 60;
            workingSeconds.value = duration.inSeconds % 60;
          }
        } else {
          isCheckedIn.value = false;
        }

        // Update Activity List with real logs
        if (todayLog.logs != null) {
          activities.value = todayLog.logs!.map((log) {
            return {
              'type': log.type == 'IN' ? 'Punch In' : 'Punch Out',
              'time': DateFormat('h:mm a').format(log.timestamp.toLocal()),
              'duration': '', // duration between logs?
              'isBreak': false,
              'icon': _getIconForActivityType(
                log.type == 'IN' ? 'Punch In' : 'Punch Out',
              ),
              'color': _getColorForActivityType(
                log.type == 'IN' ? 'Punch In' : 'Punch Out',
              ),
            };
          }).toList();
        }
      } else {
        isCheckedIn.value = false;
        // Reset timer if no log found (or just not checked in)
        workingHours.value = 0;
        workingMinutes.value = 0;
        workingSeconds.value = 0;
      }

      // Keep local source for fallback or other UI elements
      if (!isCheckedIn.value &&
          (attendanceResponse.data == null ||
              attendanceResponse.data!.isEmpty)) {
        workingHours.value = data.attendance.workingHours.hours;
        workingMinutes.value = data.attendance.workingHours.minutes;
        workingSeconds.value = data.attendance.workingHours.seconds;
      }

      if (!isCheckedIn.value) {
        workingHours.value = 0;
        workingMinutes.value = 0;
        workingSeconds.value = 0;
      }

      totalBreakHours.value = data.attendance.totalBreakTime.hours;
      totalBreakMinutes.value = data.attendance.totalBreakTime.minutes;

      // If we didn't override activities, use dummy
      if (activities.isEmpty) {
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
      }

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

    // Only start timer if user is checked in
    if (!isCheckedIn.value) {
      workingHours.value = 0;
      workingMinutes.value = 0;
      workingSeconds.value = 0;
      return;
    }

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

  Future<void> handleSwipeToPunch() async {
    if (isCheckedIn.value) {
      // Perform Check Out
      await _performCheckOut();
    } else {
      // Navigate to Face Attendance for Check In
      // Wait for result/return to refresh state
      await Get.toNamed('/face-attendance');
      // Refresh data to check if user successfully checked in
      _initializeData();
    }
  }

  Future<void> _performCheckOut() async {
    try {
      isLoading.value = true;
      print('🚀 [CheckOut] Starting Check-Out Process');

      // Get Location
      print('📍 [CheckOut] Getting Location...');
      final position = await _determinePosition();
      print('   Location: ${position.latitude}, ${position.longitude}');

      // Get Device Info
      String? deviceId;
      try {
        final deviceInfo = DeviceInfoPlugin();
        if (Platform.isAndroid) {
          final androidInfo = await deviceInfo.androidInfo;
          deviceId =
              '${androidInfo.manufacturer} ${androidInfo.model}, API ${androidInfo.version.sdkInt}';
        } else if (Platform.isIOS) {
          final iosInfo = await deviceInfo.iosInfo;
          deviceId =
              '${iosInfo.name} ${iosInfo.systemName} ${iosInfo.systemVersion}';
        }
      } catch (e) {
        print('Error getting device info: $e');
      }

      print('🔵 [CheckOut] Sending Request from Controller');
      print('   DeviceInfo: $deviceId');

      final response = await _attendanceProvider.checkOut(
        latitude: position.latitude.toString(),
        longitude: position.longitude.toString(),
        deviceInfo: deviceId,
      );

      if (response.success) {
        Get.snackbar(
          'Success',
          'Checked out successfully',
          backgroundColor: Colors.green,
          colorText: Colors.white,
        );
        // Refresh data
        _initializeData();
      } else {
        Get.snackbar(
          'Error',
          response.message,
          backgroundColor: Colors.red,
          colorText: Colors.white,
        );
      }
    } catch (e) {
      Get.snackbar(
        'Error',
        'Check-out failed: $e',
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    } finally {
      isLoading.value = false;
    }
  }

  Future<Position> _determinePosition() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return Future.error('Location services are disabled.');
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return Future.error('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      return Future.error('Location permissions are permanently denied.');
    }

    return await Geolocator.getCurrentPosition();
  }
}
