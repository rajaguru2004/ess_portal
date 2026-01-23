import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'dart:convert';
import 'package:flutter/services.dart';

class ManagerRequestsController extends GetxController {
  // Observable variables
  final isLoading = false.obs;
  final selectedTab = 0.obs; // 0: Pending, 1: Approved, 2: Rejected
  final selectedRequestType = 'all'.obs; // all, attendance, overtime, leave
  final selectAllEnabled = false.obs;

  // Data lists
  final pendingRequests = <ManagerRequest>[].obs;
  final approvedRequests = <ManagerRequest>[].obs;
  final rejectedRequests = <ManagerRequest>[].obs;
  final selectedRequestIds = <String>[].obs;

  // Stats
  final pendingCount = 0.obs;
  final approvedCount = 0.obs;
  final rejectedCount = 0.obs;

  @override
  void onInit() {
    super.onInit();
    loadRequestsData();
  }

  Future<void> loadRequestsData() async {
    try {
      isLoading.value = true;

      // Load from JSON file
      final String response = await rootBundle.loadString(
        'assets/data/manager_requests_response.json',
      );
      final data = json.decode(response);

      if (data['status'] == 'success') {
        final responseData = data['data'];

        // Parse pending requests
        pendingRequests.value = (responseData['pendingRequests'] as List)
            .map((e) => ManagerRequest.fromJson(e))
            .toList();

        // Parse approved requests
        approvedRequests.value = (responseData['approvedRequests'] as List)
            .map((e) => ManagerRequest.fromJson(e))
            .toList();

        // Parse rejected requests
        rejectedRequests.value = (responseData['rejectedRequests'] as List)
            .map((e) => ManagerRequest.fromJson(e))
            .toList();

        // Update counts
        final stats = responseData['stats'];
        pendingCount.value = stats['pending'];
        approvedCount.value = stats['approved'];
        rejectedCount.value = stats['rejected'];
      }
    } catch (e) {
      debugPrint('Error loading manager requests data: $e');
      Get.snackbar('Error', 'Failed to load requests data');
    } finally {
      isLoading.value = false;
    }
  }

  void changeTab(int index) {
    selectedTab.value = index;
    selectedRequestIds.clear();
    selectAllEnabled.value = false;
  }

  void filterByRequestType(String type) {
    selectedRequestType.value = type;
    selectedRequestIds.clear();
    selectAllEnabled.value = false;
  }

  List<ManagerRequest> get filteredRequests {
    List<ManagerRequest> requests;

    // Get requests based on selected tab
    switch (selectedTab.value) {
      case 0:
        requests = pendingRequests;
        break;
      case 1:
        requests = approvedRequests;
        break;
      case 2:
        requests = rejectedRequests;
        break;
      default:
        requests = pendingRequests;
    }

    // Filter by request type
    if (selectedRequestType.value != 'all') {
      requests = requests
          .where((req) => req.requestType == selectedRequestType.value)
          .toList();
    }

    return requests;
  }

  void toggleRequestSelection(String requestId) {
    if (selectedRequestIds.contains(requestId)) {
      selectedRequestIds.remove(requestId);
    } else {
      selectedRequestIds.add(requestId);
    }

    // Update select all state
    final filtered = filteredRequests;
    selectAllEnabled.value =
        filtered.isNotEmpty &&
        filtered.every((req) => selectedRequestIds.contains(req.id));
  }

  void toggleSelectAll() {
    selectAllEnabled.value = !selectAllEnabled.value;

    if (selectAllEnabled.value) {
      // Select all filtered requests
      selectedRequestIds.value = filteredRequests.map((req) => req.id).toList();
    } else {
      // Deselect all
      selectedRequestIds.clear();
    }
  }

  void approveRequest(String requestId) {
    // TODO: Call API to approve request
    Get.snackbar(
      'Success',
      'Request approved successfully',
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: Colors.green,
      colorText: Colors.white,
      duration: const Duration(seconds: 2),
    );
    selectedRequestIds.remove(requestId);
    loadRequestsData(); // Refresh data
  }

  void rejectRequest(String requestId) {
    // TODO: Call API to reject request
    Get.snackbar(
      'Success',
      'Request rejected',
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: Colors.orange,
      colorText: Colors.white,
      duration: const Duration(seconds: 2),
    );
    selectedRequestIds.remove(requestId);
    loadRequestsData(); // Refresh data
  }

  void approveBulkRequests() {
    if (selectedRequestIds.isEmpty) return;

    // TODO: Call API to approve multiple requests
    Get.snackbar(
      'Success',
      '${selectedRequestIds.length} requests approved successfully',
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: Colors.green,
      colorText: Colors.white,
      duration: const Duration(seconds: 2),
    );
    selectedRequestIds.clear();
    selectAllEnabled.value = false;
    loadRequestsData(); // Refresh data
  }

  void rejectBulkRequests() {
    if (selectedRequestIds.isEmpty) return;

    // TODO: Call API to reject multiple requests
    Get.snackbar(
      'Success',
      '${selectedRequestIds.length} requests rejected',
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: Colors.orange,
      colorText: Colors.white,
      duration: const Duration(seconds: 2),
    );
    selectedRequestIds.clear();
    selectAllEnabled.value = false;
    loadRequestsData(); // Refresh data
  }

  bool isRequestSelected(String requestId) {
    return selectedRequestIds.contains(requestId);
  }
}

class ManagerRequest {
  final String id;
  final String employeeId;
  final String employeeName;
  final String date;
  final String requestType;
  final String leaveType;
  final String status;
  final String reason;
  final String submittedOn;
  final String? approvedOn;
  final String? rejectedOn;
  final String? approvedBy;
  final String? rejectedBy;
  final String? managerComments;
  final String? overtimeHours;

  ManagerRequest({
    required this.id,
    required this.employeeId,
    required this.employeeName,
    required this.date,
    required this.requestType,
    required this.leaveType,
    required this.status,
    required this.reason,
    required this.submittedOn,
    this.approvedOn,
    this.rejectedOn,
    this.approvedBy,
    this.rejectedBy,
    this.managerComments,
    this.overtimeHours,
  });

  factory ManagerRequest.fromJson(Map<String, dynamic> json) {
    return ManagerRequest(
      id: json['id'],
      employeeId: json['employeeId'],
      employeeName: json['employeeName'],
      date: json['date'],
      requestType: json['requestType'],
      leaveType: json['leaveType'],
      status: json['status'],
      reason: json['reason'],
      submittedOn: json['submittedOn'],
      approvedOn: json['approvedOn'],
      rejectedOn: json['rejectedOn'],
      approvedBy: json['approvedBy'],
      rejectedBy: json['rejectedBy'],
      managerComments: json['managerComments'],
      overtimeHours: json['overtimeHours'],
    );
  }

  String get formattedDate {
    try {
      final dateTime = DateTime.parse(date);
      return DateFormat('dd MMM yyyy').format(dateTime);
    } catch (e) {
      return date;
    }
  }

  String get formattedSubmittedOn {
    try {
      final dateTime = DateTime.parse(submittedOn);
      return DateFormat('dd MMM yyyy').format(dateTime);
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

  IconData get requestTypeIcon {
    switch (requestType.toLowerCase()) {
      case 'attendance':
        return Icons.calendar_today;
      case 'overtime':
        return Icons.access_time;
      case 'leave':
        return Icons.umbrella;
      default:
        return Icons.help_outline;
    }
  }
}
