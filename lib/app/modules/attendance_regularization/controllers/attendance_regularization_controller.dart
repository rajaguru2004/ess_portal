import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'dart:convert';
import 'package:flutter/services.dart';

class AttendanceRegularizationController extends GetxController {
  // Observable variables
  final isLoading = false.obs;
  final selectedTab = 0.obs; // 0: Pending, 1: Approved, 2: Rejected

  // Data lists
  final pendingRequests = <AttendanceRequest>[].obs;
  final approvedRequests = <AttendanceRequest>[].obs;
  final rejectedRequests = <AttendanceRequest>[].obs;
  final requestTypes = <String>[].obs;

  @override
  void onInit() {
    super.onInit();
    loadRegularizationData();
  }

  Future<void> loadRegularizationData() async {
    try {
      isLoading.value = true;

      // Load from JSON file
      final String response = await rootBundle.loadString(
        'assets/data/attendance_regularization_response.json',
      );
      final data = json.decode(response);

      if (data['status'] == 'success') {
        final responseData = data['data'];

        // Parse pending requests
        pendingRequests.value = (responseData['pendingRequests'] as List)
            .map((e) => AttendanceRequest.fromJson(e))
            .toList();

        // Parse approved requests
        approvedRequests.value = (responseData['approvedRequests'] as List)
            .map((e) => AttendanceRequest.fromJson(e))
            .toList();

        // Parse rejected requests
        rejectedRequests.value = (responseData['rejectedRequests'] as List)
            .map((e) => AttendanceRequest.fromJson(e))
            .toList();

        // Parse request types
        requestTypes.value = List<String>.from(responseData['requestTypes']);
      }
    } catch (e) {
      debugPrint('Error loading regularization data: $e');
      Get.snackbar('Error', 'Failed to load data');
    } finally {
      isLoading.value = false;
    }
  }

  void changeTab(int index) {
    selectedTab.value = index;
  }

  void navigateToNewRequest() {
    Get.toNamed('/attendance-regularization/new');
  }

  void approveRequest(String requestId) {
    // TODO: Call API to approve request
    Get.snackbar(
      'Success',
      'Request approved successfully',
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: Colors.green,
      colorText: Colors.white,
    );
    loadRegularizationData(); // Refresh data
  }

  void rejectRequest(String requestId) {
    // TODO: Call API to reject request
    Get.snackbar(
      'Success',
      'Request rejected',
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: Colors.orange,
      colorText: Colors.white,
    );
    loadRegularizationData(); // Refresh data
  }

  void requestClarification(String requestId) {
    // TODO: Call API to request clarification
    Get.snackbar(
      'Success',
      'Clarification requested',
      snackPosition: SnackPosition.BOTTOM,
    );
  }
}

class AttendanceRequest {
  final String id;
  final String employeeId;
  final String employeeName;
  final String date;
  final String requestType;
  final String reason;
  final String status;
  final String requestedTime;
  final String submittedOn;
  final String managerName;
  final String? approvedOn;
  final String? rejectedOn;
  final String? managerComments;

  AttendanceRequest({
    required this.id,
    required this.employeeId,
    required this.employeeName,
    required this.date,
    required this.requestType,
    required this.reason,
    required this.status,
    required this.requestedTime,
    required this.submittedOn,
    required this.managerName,
    this.approvedOn,
    this.rejectedOn,
    this.managerComments,
  });

  factory AttendanceRequest.fromJson(Map<String, dynamic> json) {
    return AttendanceRequest(
      id: json['id'],
      employeeId: json['employeeId'],
      employeeName: json['employeeName'],
      date: json['date'],
      requestType: json['requestType'],
      reason: json['reason'],
      status: json['status'],
      requestedTime: json['requestedTime'],
      submittedOn: json['submittedOn'],
      managerName: json['managerName'],
      approvedOn: json['approvedOn'],
      rejectedOn: json['rejectedOn'],
      managerComments: json['managerComments'],
    );
  }

  String get formattedDate {
    try {
      final dateTime = DateTime.parse(date);
      return DateFormat('MMM dd, yyyy').format(dateTime);
    } catch (e) {
      return date;
    }
  }

  String get formattedSubmittedOn {
    try {
      final dateTime = DateTime.parse(submittedOn);
      return DateFormat('MMM dd, yyyy HH:mm').format(dateTime);
    } catch (e) {
      return submittedOn;
    }
  }

  Color get statusColor {
    switch (status.toLowerCase()) {
      case 'approved':
        return Colors.green;
      case 'rejected':
        return Colors.red;
      case 'pending':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }
}
