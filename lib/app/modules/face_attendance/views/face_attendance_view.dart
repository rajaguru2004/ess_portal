import 'package:camera/camera.dart';
import 'package:ess_portal/app/theme/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import '../controllers/face_attendance_controller.dart';

class FaceAttendanceView extends GetView<FaceAttendanceController> {
  const FaceAttendanceView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      body: Obx(() {
        if (controller.showSuccess.value) {
          return _buildSuccessScreen(context);
        }

        return _buildCameraScreen(context);
      }),
    );
  }

  Widget _buildCameraScreen(BuildContext context) {
    // Use Stack to layer camera and UI elements
    return Stack(
      children: [
        // Camera Preview - fills entire screen
        Obx(() {
          if (controller.isLoading.value) {
            return Center(
              child: CircularProgressIndicator(
                color: Theme.of(context).colorScheme.primary,
              ),
            );
          }

          if (!controller.isCameraInitialized.value ||
              controller.cameraController == null) {
            return Center(
              child: AppText(
                'Camera not available',
                style: TextStyle(color: Colors.white),
              ),
            );
          }

          // Fullscreen camera with overlays
          return Stack(
            fit: StackFit.expand,
            children: [
              // Fullscreen camera preview
              Positioned.fill(
                child: FittedBox(
                  fit: BoxFit.cover,
                  child: SizedBox(
                    width:
                        controller.cameraController!.value.previewSize!.height,
                    height:
                        controller.cameraController!.value.previewSize!.width,
                    child: CameraPreview(controller.cameraController!),
                  ),
                ),
              ),

              // Face guide overlay
              Center(
                child: Container(
                  width: 280,
                  height: 350,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: Colors.white.withOpacity(0.8),
                      width: 3,
                    ),
                  ),
                ),
              ),

              // Instructions overlay - positioned below header
              Positioned(
                top: 100, // Below the header
                left: 20,
                right: 20,
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.6),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: AppText(
                    'Face forward & look directly at camera',
                    style: TextStyle(color: Colors.white, fontSize: 14),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),

              // Guidelines at bottom - above capture button
              Positioned(
                bottom: 120, // Above the capture button
                left: 20,
                right: 20,
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.6),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _buildGuideline(
                        Icons.check_circle,
                        'Ensure that your forehead, ears, and chin are fully visible within the frame.',
                      ),
                      const SizedBox(height: 12),
                      _buildGuideline(
                        Icons.check_circle,
                        'Please do not wear glasses, a mask, or any other accessories that might cover your face.',
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        }),

        // Header - absolute position at top, always visible
        Positioned(
          top: 0,
          left: 0,
          right: 0,
          child: SafeArea(
            bottom: false,
            child: Container(
              padding: const EdgeInsets.all(16),
              color: Theme.of(context).colorScheme.surface,
              child: Row(
                children: [
                  IconButton(
                    onPressed: () => Get.back(),
                    icon: Icon(
                      Icons.close,
                      color: Theme.of(context).colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(width: 8),
                  AppText(
                    'Take your photo',
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.onSurface,
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),

        // Capture button - absolute position at bottom, always visible
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          child: SafeArea(
            top: false,
            child: Obx(
              () => Container(
                padding: const EdgeInsets.all(24),
                color: Theme.of(context).colorScheme.surface,
                child: controller.isProcessing.value
                    ? const Center(child: CircularProgressIndicator())
                    : ElevatedButton(
                        onPressed:
                            (!controller.isCameraInitialized.value ||
                                controller.cameraController == null)
                            ? null
                            : controller.capturePhoto,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF2563EB),
                          minimumSize: const Size(double.infinity, 56),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: AppText(
                          'Capture Photo',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                      ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildGuideline(IconData icon, String text) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: Colors.white, size: 20),
        const SizedBox(width: 8),
        Expanded(
          child: AppText(
            text,
            style: TextStyle(color: Colors.white, fontSize: 12, height: 1.4),
          ),
        ),
      ],
    );
  }

  Widget _buildSuccessScreen(BuildContext context) {
    return Container(
      color: Theme.of(context).colorScheme.surface,
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Success Icon
              Container(
                width: 100,
                height: 100,
                decoration: const BoxDecoration(
                  color: Color(0xFF10B981),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check, color: Colors.white, size: 60),
              ),

              const SizedBox(height: 32),

              // Success Title
              AppText(
                'Clock in successful',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).colorScheme.onSurface,
                ),
              ),

              const SizedBox(height: 12),

              // Success Message
              AppText(
                'Great job! Your clock in has been successfully saved.',
                style: TextStyle(
                  fontSize: 16,
                  color: Theme.of(context).textTheme.bodyMedium?.color,
                ),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: 48),

              // Back to Home Button
              ElevatedButton(
                onPressed: controller.navigateToHome,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2563EB),
                  minimumSize: const Size(double.infinity, 56),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: AppText(
                  'Back to Home',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // View Attendance Log Button
              OutlinedButton(
                onPressed: controller.navigateToAttendanceLog,
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 56),
                  side: const BorderSide(color: Color(0xFF2563EB), width: 2),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: AppText(
                  'View attendance log',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF2563EB),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
