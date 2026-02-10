import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import '../../../data/models/leave_model.dart';
import '../../../data/providers/leave_provider.dart';

class ApplyLeaveScreenController extends GetxController {
  final LeaveProvider _leaveProvider = LeaveProvider();

  final isLoading = false.obs;
  final isApplying = false.obs;

  // Data from API
  final leaveBalances = <LeaveBalance>[].obs;
  final myLeaves = <LeaveApplication>[].obs;

  final selectedLeaveBalance = Rxn<LeaveBalance>();
  final startDate = DateTime.now().obs;
  final endDate = DateTime.now().obs;
  final reasonController = TextEditingController();

  // For the calendar selection
  final focusedDay = DateTime.now().obs;
  final rangeStart = Rxn<DateTime>();
  final rangeEnd = Rxn<DateTime>();

  @override
  void onInit() {
    super.onInit();
    rangeStart.value = startDate.value;
    rangeEnd.value = endDate.value;
    fetchData();
  }

  @override
  void onClose() {
    reasonController.dispose();
    super.onClose();
  }

  Future<void> fetchData() async {
    try {
      isLoading.value = true;
      final balanceResponse = await _leaveProvider.getLeaveBalance();
      leaveBalances.value = balanceResponse.data;

      if (leaveBalances.isNotEmpty) {
        selectedLeaveBalance.value = leaveBalances.first;
      }

      final leavesResponse = await _leaveProvider.getMyLeaves(
        DateTime.now().year,
      );
      myLeaves.value = leavesResponse.data;
    } catch (e) {
      Get.snackbar("Error", e.toString(), snackPosition: SnackPosition.BOTTOM);
    } finally {
      isLoading.value = false;
    }
  }

  void setLeaveType(LeaveBalance? balance) {
    if (balance != null) {
      selectedLeaveBalance.value = balance;
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

  Future<void> applyLeave() async {
    if (selectedLeaveBalance.value == null) {
      Get.snackbar(
        "Error",
        "Please select a leave type",
        snackPosition: SnackPosition.BOTTOM,
      );
      return;
    }

    if (reasonController.text.isEmpty) {
      Get.snackbar(
        "Error",
        "Please provide a reason",
        snackPosition: SnackPosition.BOTTOM,
      );
      return;
    }

    try {
      isApplying.value = true;
      final response = await _leaveProvider.applyLeave(
        leaveTypeId: selectedLeaveBalance.value!.leaveTypeId,
        startDate: startDate.value.toIso8601String(),
        endDate: endDate.value.toIso8601String(),
        reason: reasonController.text,
      );

      if (response.success) {
        Get.snackbar(
          "Success",
          response.message,
          snackPosition: SnackPosition.BOTTOM,
        );
        reasonController.clear();
        fetchData(); // Refresh data
      }
    } catch (e) {
      Get.snackbar("Error", e.toString(), snackPosition: SnackPosition.BOTTOM);
    } finally {
      isApplying.value = false;
    }
  }

  Future<void> cancelLeave(String leaveId) async {
    try {
      final success = await _leaveProvider.cancelLeave(leaveId);
      if (success) {
        Get.snackbar(
          "Success",
          "Leave cancelled successfully",
          snackPosition: SnackPosition.BOTTOM,
        );
        fetchData(); // Refresh data
      }
    } catch (e) {
      Get.snackbar("Error", e.toString(), snackPosition: SnackPosition.BOTTOM);
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
    return 'You are applying $days days ${selectedLeaveBalance.value?.leaveType.name.toLowerCase() ?? ""}';
  }
}
