import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/models/manager_models.dart';
import '../../../data/services/manager_service.dart';
import '../../../routes/app_pages.dart';

class MakeManagerController extends GetxController {
  final ManagerService _managerService = ManagerService();

  // Observable state
  final isLoading = false.obs;
  final isProcessing = false.obs;
  final userList = <UserItem>[].obs;
  final selectedUsers = <String>{}.obs;
  final errorMessage = ''.obs;

  @override
  void onInit() {
    super.onInit();
    fetchAllUsers();
  }

  /// Fetch all users from the API
  Future<void> fetchAllUsers() async {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      final response = await _managerService.getAllUsers();

      if (response.success) {
        // Filter out users who are already managers and head managers
        final filteredUsers = response.data
            .where((user) => !user.isManager && !user.isHeadManager)
            .toList();
        userList.assignAll(filteredUsers);
      } else {
        errorMessage.value = response.message;
        Get.snackbar(
          'Error',
          response.message,
          snackPosition: SnackPosition.BOTTOM,
        );
      }
    } catch (e) {
      errorMessage.value = 'Failed to fetch users: $e';
      Get.snackbar(
        'Error',
        'Failed to fetch users: $e',
        snackPosition: SnackPosition.BOTTOM,
      );
    } finally {
      isLoading.value = false;
    }
  }

  /// Toggle user selection
  void toggleUserSelection(String userId) {
    if (selectedUsers.contains(userId)) {
      selectedUsers.remove(userId);
    } else {
      selectedUsers.add(userId);
    }
  }

  /// Check if user is selected
  bool isUserSelected(String userId) {
    return selectedUsers.contains(userId);
  }

  /// Make selected users managers
  Future<void> makeSelectedUsersManagers() async {
    if (selectedUsers.isEmpty) {
      Get.snackbar(
        'No Selection',
        'Please select at least one user',
        snackPosition: SnackPosition.BOTTOM,
      );
      return;
    }

    // Confirmation dialog
    final confirmed = await Get.dialog<bool>(
      AlertDialog(
        title: const Text('Confirm'),
        content: Text(
          'Are you sure you want to make ${selectedUsers.length} user(s) manager(s)?',
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

      for (final userId in selectedUsers) {
        final response = await _managerService.makeManager(userId);
        if (response.success) {
          successCount++;
        } else {
          failureCount++;
        }
      }

      if (failureCount == 0) {
        Get.snackbar(
          'Success',
          'Successfully promoted $successCount user(s) to manager',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Get.theme.colorScheme.primary,
          colorText: Get.theme.colorScheme.onPrimary,
        );

        // Clear selection and refresh
        selectedUsers.clear();
        await fetchAllUsers();
      } else {
        Get.snackbar(
          'Partial Success',
          'Promoted $successCount user(s), failed for $failureCount',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Get.theme.colorScheme.error,
          colorText: Get.theme.colorScheme.onError,
        );
        await fetchAllUsers();
      }
    } catch (e) {
      Get.snackbar(
        'Error',
        'Failed to promote users: $e',
        snackPosition: SnackPosition.BOTTOM,
      );
    } finally {
      isProcessing.value = false;
    }
  }

  /// Navigate to Assign Employees screen
  void navigateToAssignEmployees() {
    Get.toNamed(Routes.ASSIGN_EMPLOYEES);
  }

  /// Get initials from full name for avatar
  String getInitials(String fullName) {
    if (fullName.isEmpty) return 'U';
    final parts = fullName.trim().split(' ');
    if (parts.length == 1) return parts[0][0].toUpperCase();
    return '${parts[0][0]}${parts[parts.length - 1][0]}'.toUpperCase();
  }
}
