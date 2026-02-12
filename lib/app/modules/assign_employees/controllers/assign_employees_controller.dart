import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/models/manager_models.dart';
import '../../../data/services/manager_service.dart';

class AssignEmployeesController extends GetxController {
  final ManagerService _managerService = ManagerService();

  // Observable state
  final isLoading = false.obs;
  final isProcessing = false.obs;
  final managersList = <ManagerItem>[].obs;
  final allUsers = <UserItem>[].obs;
  final selectedManager = Rxn<ManagerItem>();
  final selectedEmployees = <String>{}.obs;
  final errorMessage = ''.obs;

  @override
  void onInit() {
    super.onInit();
    fetchData();
  }

  /// Fetch managers and all users
  Future<void> fetchData() async {
    await Future.wait([fetchManagers(), fetchAllUsers()]);
  }

  /// Fetch manager hierarchy
  Future<void> fetchManagers() async {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      final response = await _managerService.getManagers();

      if (response.success) {
        managersList.value = response.data;
      } else {
        errorMessage.value = response.message;
        Get.snackbar(
          'Error',
          response.message,
          snackPosition: SnackPosition.BOTTOM,
        );
      }
    } catch (e) {
      errorMessage.value = 'Failed to fetch managers: $e';
      Get.snackbar(
        'Error',
        'Failed to fetch managers: $e',
        snackPosition: SnackPosition.BOTTOM,
      );
    } finally {
      isLoading.value = false;
    }
  }

  /// Fetch all users
  Future<void> fetchAllUsers() async {
    try {
      final response = await _managerService.getAllUsers();

      if (response.success) {
        allUsers.value = response.data;
      } else {
        Get.snackbar(
          'Error',
          response.message,
          snackPosition: SnackPosition.BOTTOM,
        );
      }
    } catch (e) {
      Get.snackbar(
        'Error',
        'Failed to fetch users: $e',
        snackPosition: SnackPosition.BOTTOM,
      );
    }
  }

  /// Select a manager
  void selectManager(ManagerItem manager) {
    selectedManager.value = manager;
    selectedEmployees.clear();
  }

  /// Toggle employee selection
  void toggleEmployeeSelection(String userId) {
    if (selectedEmployees.contains(userId)) {
      selectedEmployees.remove(userId);
    } else {
      selectedEmployees.add(userId);
    }
  }

  /// Check if employee is selected
  bool isEmployeeSelected(String userId) {
    return selectedEmployees.contains(userId);
  }

  /// Get available employees (not assigned to selected manager)
  List<UserItem> getAvailableEmployees() {
    if (selectedManager.value == null) return allUsers;

    final subordinateIds = selectedManager.value!.subordinates
        .map((s) => s.id)
        .toSet();

    return allUsers
        .where(
          (user) =>
              !subordinateIds.contains(user.id) &&
              user.id != selectedManager.value!.id &&
              !user.isManager &&
              !user.isHeadManager,
        )
        .toList();
  }

  /// Assign selected employees to manager
  Future<void> assignSelectedEmployees() async {
    if (selectedManager.value == null) {
      Get.snackbar(
        'No Manager Selected',
        'Please select a manager first',
        snackPosition: SnackPosition.BOTTOM,
      );
      return;
    }

    if (selectedEmployees.isEmpty) {
      Get.snackbar(
        'No Employees Selected',
        'Please select at least one employee',
        snackPosition: SnackPosition.BOTTOM,
      );
      return;
    }

    // Confirmation dialog
    final confirmed = await Get.dialog<bool>(
      AlertDialog(
        title: const Text('Confirm'),
        content: Text(
          'Assign ${selectedEmployees.length} employee(s) to ${selectedManager.value!.fullName}?',
        ),
        actions: [
          TextButton(
            onPressed: () => Get.back(result: false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Get.back(result: true),
            child: const Text('Confirm'),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    try {
      isProcessing.value = true;

      int successCount = 0;
      int failureCount = 0;

      for (final employeeId in selectedEmployees) {
        final response = await _managerService.assignManager(
          employeeId,
          selectedManager.value!.id,
        );
        if (response.success) {
          successCount++;
        } else {
          failureCount++;
        }
      }

      if (failureCount == 0) {
        Get.snackbar(
          'Success',
          'Successfully assigned $successCount employee(s)',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Get.theme.colorScheme.primary,
          colorText: Get.theme.colorScheme.onPrimary,
        );

        // Clear selection and refresh
        selectedEmployees.clear();
        await fetchData();
      } else {
        Get.snackbar(
          'Partial Success',
          'Assigned $successCount employee(s), failed for $failureCount',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Get.theme.colorScheme.error,
          colorText: Get.theme.colorScheme.onError,
        );
        await fetchData();
      }
    } catch (e) {
      Get.snackbar(
        'Error',
        'Failed to assign employees: $e',
        snackPosition: SnackPosition.BOTTOM,
      );
    } finally {
      isProcessing.value = false;
    }
  }

  /// Refresh all data
  Future<void> refreshData() async {
    await fetchData();
  }

  /// Get initials from full name for avatar
  String getInitials(String fullName) {
    if (fullName.isEmpty) return 'U';
    final parts = fullName.trim().split(' ');
    if (parts.length == 1) return parts[0][0].toUpperCase();
    return '${parts[0][0]}${parts[parts.length - 1][0]}'.toUpperCase();
  }
}
