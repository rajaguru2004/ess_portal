import 'package:get/get.dart';

import 'package:intl/intl.dart';

class ApplyLeaveScreenController extends GetxController {
  final leaveType = 'Sick Leave'.obs;
  final startDate = DateTime.now().obs;
  final endDate = DateTime.now().add(const Duration(days: 2)).obs;

  // For the calendar selection
  final focusedDay = DateTime.now().obs;
  final selectedDay = DateTime.now().obs;
  final rangeStart = Rxn<DateTime>();
  final rangeEnd = Rxn<DateTime>();

  final leaveTypes = [
    'Sick Leave',
    'Casual Leave',
    'Privilege Leave',
    'Unpaid Leave',
  ];

  @override
  void onInit() {
    super.onInit();
    rangeStart.value = startDate.value;
    rangeEnd.value = endDate.value;
  }

  void setLeaveType(String? type) {
    if (type != null) {
      leaveType.value = type;
    }
  }

  void updateDateRange(DateTime? start, DateTime? end, DateTime? focused) {
    focusedDay.value = focused ?? DateTime.now();
    rangeStart.value = start;
    rangeEnd.value = end;
  }

  void applyDateSelection() {
    if (rangeStart.value != null) {
      startDate.value = rangeStart.value!;
      endDate.value = rangeEnd.value ?? rangeStart.value!;
      Get.back(); // Close modal
    }
  }

  String get formattedStartDate =>
      DateFormat('dd MMM yyyy').format(startDate.value);
  String get formattedEndDate =>
      DateFormat('dd MMM yyyy').format(endDate.value);

  String get durationString {
    final start = rangeStart.value;
    final end = rangeEnd.value;
    if (start == null) return '';
    final days = (end ?? start).difference(start).inDays + 1;
    return 'You are applying $days days ${leaveType.value.toLowerCase()}';
  }
}
