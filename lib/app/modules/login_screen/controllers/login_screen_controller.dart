import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/services/auth_service.dart';
import '../../../data/services/storage_service.dart';

class LoginScreenController extends GetxController {
  // Text editing controllers
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();

  // Observable text values for validation
  final username = ''.obs;
  final password = ''.obs;

  // Services
  final _authService = AuthService();
  final _storageService = StorageService();

  // Observable state variables
  final isLoading = false.obs;
  final errorMessage = ''.obs;
  final isPasswordVisible = false.obs;

  @override
  void onInit() {
    super.onInit();
    // Listen to text changes
    usernameController.addListener(() {
      username.value = usernameController.text;
      _clearError();
    });
    passwordController.addListener(() {
      password.value = passwordController.text;
      _clearError();
    });
  }

  @override
  void onClose() {
    usernameController.dispose();
    passwordController.dispose();
    super.onClose();
  }

  /// Clear error message when user types
  void _clearError() {
    if (errorMessage.value.isNotEmpty) {
      errorMessage.value = '';
    }
  }

  /// Toggle password visibility
  void togglePasswordVisibility() {
    isPasswordVisible.value = !isPasswordVisible.value;
  }

  /// Check if login button should be enabled
  bool get isLoginButtonEnabled {
    return username.value.trim().isNotEmpty &&
        password.value.trim().isNotEmpty &&
        !isLoading.value;
  }

  /// Perform login validation and authentication
  Future<void> login() async {
    final username = usernameController.text.trim();
    final password = passwordController.text.trim();

    // Validate empty fields
    if (username.isEmpty || password.isEmpty) {
      errorMessage.value = 'Please enter both username and password';
      return;
    }

    try {
      isLoading.value = true;
      errorMessage.value = '';

      // Call API
      final response = await _authService.login(username, password);

      if (response.success && response.data != null) {
        // Save data to secure storage
        await _storageService.saveAuthData(response.data!);

        // Print success message for debugging
        print('✅ Login Success!');
        print('Message: ${response.message}');
        print('User: ${response.data!.user}');

        // Navigate to main layout (replace all previous routes)
        Get.offAllNamed('/main');
      } else {
        // Show error message
        errorMessage.value = response.message.isNotEmpty
            ? response.message
            : 'Login failed';
      }
    } catch (e) {
      errorMessage.value = 'An error occurred. Please try again.';
      print('❌ Login Error: $e');
    } finally {
      isLoading.value = false;
    }
  }
}
