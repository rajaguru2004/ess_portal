import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/sources/login_local_source.dart';

class LoginScreenController extends GetxController {
  // Text editing controllers
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();

  // Observable text values for validation
  final username = ''.obs;
  final password = ''.obs;

  // Local data source
  final loginLocalSource = LoginLocalSource();

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
      errorMessage.value = await loginLocalSource.getEmptyCredentialsError();
      return;
    }

    try {
      isLoading.value = true;
      errorMessage.value = '';

      // Validate credentials
      final isValid = await loginLocalSource.validateCredentials(
        username,
        password,
      );

      if (isValid) {
        // Get user data
        final loginResponse = await loginLocalSource.getUserData();

        // Print success message
        print('✅ Login Success!');
        print('Status: ${loginResponse.status}');
        print('Message: ${loginResponse.message}');
        print('User: ${loginResponse.user}');
        print('Employee ID: ${loginResponse.user.employeeId}');
        print('Name: ${loginResponse.user.name}');
        print('Role: ${loginResponse.user.role}');

        // Navigate to main layout (replace all previous routes)
        Get.offAllNamed('/main');
      } else {
        // Show error message
        errorMessage.value = await loginLocalSource
            .getInvalidCredentialsError();
      }
    } catch (e) {
      errorMessage.value = 'An error occurred. Please try again.';
      print('❌ Login Error: $e');
    } finally {
      isLoading.value = false;
    }
  }
}
