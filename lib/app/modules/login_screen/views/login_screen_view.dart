import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../theme/app_theme.dart';
import '../controllers/login_screen_controller.dart';

class LoginScreenView extends GetView<LoginScreenController> {
  const LoginScreenView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            // Determine if we're on a large screen (web/tablet)
            final isLargeScreen = constraints.maxWidth > 600;

            return Center(
              child: SingleChildScrollView(
                padding: EdgeInsets.symmetric(
                  horizontal: isLargeScreen ? 48 : 24,
                  vertical: 24,
                ),
                child: ConstrainedBox(
                  constraints: BoxConstraints(
                    maxWidth: isLargeScreen ? 450 : double.infinity,
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Logo and branding
                      _buildLogo(context),

                      const SizedBox(height: 48),

                      // Title
                      _buildTitle(context),

                      const SizedBox(height: 8),

                      // Subtitle
                      _buildSubtitle(context),

                      const SizedBox(height: 40),

                      // Username field
                      _buildUsernameField(),

                      const SizedBox(height: 20),

                      // Password field
                      _buildPasswordField(),

                      const SizedBox(height: 12),

                      // Error message
                      _buildErrorMessage(),

                      const SizedBox(height: 24),

                      // Login button
                      _buildLoginButton(),

                      const SizedBox(height: 16),

                      // Forgot password link
                      _buildForgotPassword(context),

                      const SizedBox(height: 48),

                      // App version
                      _buildAppVersion(context),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  /// Build app logo
  Widget _buildLogo(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
        shape: BoxShape.circle,
      ),
      child: Icon(
        Icons.business,
        size: 80,
        color: Theme.of(context).colorScheme.primary,
      ),
    );
  }

  /// Build title text
  Widget _buildTitle(BuildContext context) {
    return Text(
      'Employee Login',
      style: Theme.of(context).textTheme.displaySmall,
      textAlign: TextAlign.center,
    );
  }

  /// Build subtitle text
  Widget _buildSubtitle(BuildContext context) {
    return Text(
      'Sign in to continue',
      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
        color: Theme.of(context).textTheme.bodySmall?.color,
      ),
      textAlign: TextAlign.center,
    );
  }

  /// Build username/employee ID field
  Widget _buildUsernameField() {
    return Obx(
      () => TextField(
        controller: controller.usernameController,
        enabled: !controller.isLoading.value,
        keyboardType: TextInputType.text,
        textInputAction: TextInputAction.next,
        decoration: const InputDecoration(
          labelText: 'Employee ID / Username',
          hintText: 'Enter your employee ID',
          prefixIcon: Icon(Icons.person_outline),
        ),
      ),
    );
  }

  /// Build password field with visibility toggle
  Widget _buildPasswordField() {
    return Obx(
      () => TextField(
        controller: controller.passwordController,
        enabled: !controller.isLoading.value,
        obscureText: !controller.isPasswordVisible.value,
        textInputAction: TextInputAction.done,
        onSubmitted: (_) {
          if (controller.isLoginButtonEnabled) {
            controller.login();
          }
        },
        decoration: InputDecoration(
          labelText: 'Password',
          hintText: 'Enter your password',
          prefixIcon: const Icon(Icons.lock_outline),
          suffixIcon: IconButton(
            icon: Icon(
              controller.isPasswordVisible.value
                  ? Icons.visibility_off_outlined
                  : Icons.visibility_outlined,
            ),
            onPressed: controller.togglePasswordVisibility,
          ),
        ),
      ),
    );
  }

  /// Build error message display
  Widget _buildErrorMessage() {
    return Obx(() {
      if (controller.errorMessage.value.isEmpty) {
        return const SizedBox.shrink();
      }

      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: Get.theme.colorScheme.error.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: Get.theme.colorScheme.error.withOpacity(0.3),
          ),
        ),
        child: Row(
          children: [
            Icon(
              Icons.error_outline,
              color: Get.theme.colorScheme.error,
              size: 20,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                controller.errorMessage.value,
                style: AppTheme.globalFont.copyWith(
                  color: Get.theme.colorScheme.error,
                  fontSize: 14,
                ),
              ),
            ),
          ],
        ),
      );
    });
  }

  /// Build login button
  Widget _buildLoginButton() {
    return Obx(() {
      final isEnabled = controller.isLoginButtonEnabled;

      return SizedBox(
        height: 56,
        child: ElevatedButton(
          onPressed: isEnabled ? controller.login : null,
          child: controller.isLoading.value
              ? SizedBox(
                  height: 24,
                  width: 24,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: Get.theme.colorScheme.onPrimary,
                  ),
                )
              : const Text('Login'),
        ),
      );
    });
  }

  /// Build forgot password link
  Widget _buildForgotPassword(BuildContext context) {
    return TextButton(
      onPressed: null, // Disabled as per requirements
      child: Text(
        'Forgot Password?',
        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
          color: Theme.of(
            context,
          ).textTheme.labelLarge?.color?.withOpacity(0.5),
        ),
      ),
    );
  }

  /// Build app version display
  Widget _buildAppVersion(BuildContext context) {
    return Text(
      'Version 1.0.0',
      style: Theme.of(context).textTheme.bodySmall,
      textAlign: TextAlign.center,
    );
  }
}
