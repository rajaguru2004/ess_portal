import 'package:get/get.dart';
import '../../../data/models/manager_models.dart';
import '../../../data/services/manager_service.dart';
import '../../../routes/app_pages.dart';

class UserListController extends GetxController {
  final ManagerService _managerService = ManagerService();

  // Observable state
  final isLoading = false.obs;
  final userList = <UserItem>[].obs;
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
        userList.value = response.data;
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

  /// Refresh users (for pull-to-refresh)
  Future<void> refreshUsers() async {
    await fetchAllUsers();
  }

  /// Navigate to Make Manager screen
  void navigateToMakeManager() {
    Get.toNamed(Routes.MAKE_MANAGER);
  }

  /// Get initials from full name for avatar
  String getInitials(String fullName) {
    if (fullName.isEmpty) return 'U';
    final parts = fullName.trim().split(' ');
    if (parts.length == 1) return parts[0][0].toUpperCase();
    return '${parts[0][0]}${parts[parts.length - 1][0]}'.toUpperCase();
  }
}
