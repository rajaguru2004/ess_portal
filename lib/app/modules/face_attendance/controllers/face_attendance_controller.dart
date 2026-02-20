import 'package:camera/camera.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:geolocator/geolocator.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:permission_handler/permission_handler.dart';
import '../../../data/providers/attendance_provider.dart';

class FaceAttendanceController extends GetxController {
  // Observable variables
  final isLoading = false.obs;
  final isCameraInitialized = false.obs;
  final isProcessing = false.obs;
  final showSuccess = false.obs;

  // Camera
  CameraController? cameraController;
  List<CameraDescription>? cameras;

  // Metadata
  String? employeeId;
  String? deviceId;
  Position? currentPosition;
  XFile? capturedImage;
  // Provider
  final AttendanceProvider _attendanceProvider = AttendanceProvider();

  @override
  void onInit() {
    super.onInit();
    employeeId = '123456'; // TODO: Get from user session/storage
    initializeCamera();
  }

  @override
  void onClose() {
    cameraController?.dispose();
    super.onClose();
  }

  Future<void> initializeCamera() async {
    print('📷 [FaceAttendanceController] Initializing Camera...');
    try {
      isLoading.value = true;

      // Request permissions
      print('   Requesting permissions...');
      final cameraStatus = await Permission.camera.request();

      final locationStatus = await Permission.location.request();

      if (cameraStatus.isDenied || locationStatus.isDenied) {
        Get.snackbar(
          'Permission Denied',
          'Camera and Location permissions are required',
          snackPosition: SnackPosition.BOTTOM,
        );
        return;
      }

      // Get available cameras
      cameras = await availableCameras();
      if (cameras == null || cameras!.isEmpty) {
        Get.snackbar('Error', 'No cameras available');
        return;
      }

      // Initialize front camera
      final frontCamera = cameras!.firstWhere(
        (camera) => camera.lensDirection == CameraLensDirection.front,
        orElse: () => cameras!.first,
      );

      cameraController = CameraController(
        frontCamera,
        ResolutionPreset.high,
        enableAudio: false,
      );

      await cameraController!.initialize();
      isCameraInitialized.value = true;

      // Get device info
      await getDeviceInfo();

      // Get current location
      await getCurrentLocation();
    } catch (e) {
      Get.snackbar('Error', 'Failed to initialize camera: $e');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> getDeviceInfo() async {
    try {
      final deviceInfo = DeviceInfoPlugin();
      if (kIsWeb) {
        final webInfo = await deviceInfo.webBrowserInfo;
        deviceId = webInfo.userAgent;
      } else if (GetPlatform.isAndroid) {
        final androidInfo = await deviceInfo.androidInfo;
        deviceId = androidInfo.id;
      } else if (GetPlatform.isIOS) {
        final iosInfo = await deviceInfo.iosInfo;
        deviceId = iosInfo.identifierForVendor;
      }
    } catch (e) {
      debugPrint('Error getting device info: $e');
      deviceId = 'unknown';
    }
  }

  Future<void> getCurrentLocation() async {
    try {
      final permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied ||
          permission == LocationPermission.deniedForever) {
        return;
      }

      currentPosition = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
    } catch (e) {
      debugPrint('Error getting location: $e');
    }
  }

  Future<void> capturePhoto() async {
    print('📸 [FaceAttendanceController] Capturing Photo...');
    if (cameraController == null || !cameraController!.value.isInitialized) {
      print('❌ [FaceAttendanceController] Camera not initialized');
      return;
    }

    try {
      isProcessing.value = true;

      // Capture image
      capturedImage = await cameraController!.takePicture();
      print('   Photo captured at: ${capturedImage?.path}');

      // Refresh location before submission
      print('📍 [FaceAttendanceController] Refreshing Location...');
      await getCurrentLocation();
      print(
        '   Location: ${currentPosition?.latitude}, ${currentPosition?.longitude}',
      );

      // Call API
      await uploadFaceAttendance();
    } catch (e) {
      print('❌ [FaceAttendanceController] Capture Error: $e');
      Get.snackbar('Error', 'Failed to capture photo: $e');
      isProcessing.value = false;
    }
  }

  Future<void> uploadFaceAttendance() async {
    print(
      '🚀 [FaceAttendanceController] uploadFaceAttendance: Starting upload process...',
    );
    try {
      // Format lat/lng with fixed decimal places to avoid scientific notation
      // and ensure the value satisfies the backend regex (max 10 decimal places).
      // iOS Safari geolocation can produce very high-precision doubles whose
      // `.toString()` in Dart may exceed 10 decimals or use scientific notation.
      final lat = (currentPosition?.latitude ?? 0.0).toStringAsFixed(7);
      final lng = (currentPosition?.longitude ?? 0.0).toStringAsFixed(7);

      print(
        '📍 [FaceAttendanceController] Formatted coords: lat=$lat, lng=$lng',
      );

      // Call API
      final response = await _attendanceProvider.checkIn(
        photo: capturedImage!,
        latitude: lat,
        longitude: lng,
        deviceInfo: deviceId,
      );

      print(
        '✅ [FaceAttendanceController] Upload Result: Success=${response.success}',
      );

      if (response.success) {
        // Success
        showSuccess.value = true;
        Get.snackbar(
          'Success',
          'Checked in successfully',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.green,
          colorText: Colors.white,
        );
      } else {
        // Error handling based on response message — show full details for debugging
        Get.snackbar(
          'Check-in Failed',
          '[${response.message}]',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
          duration: const Duration(seconds: 10),
        );
      }
    } catch (e, stackTrace) {
      debugPrint('❌ [FaceAttendanceController] Upload error: $e');
      debugPrint('   Stack: $stackTrace');
      // Show the full error for on-device debugging
      final errorMsg = e.toString().replaceFirst('Exception: ', '');
      Get.snackbar(
        'Upload Error',
        errorMsg.isNotEmpty
            ? 'DEBUG: $errorMsg'
            : 'Network error. Please check your connection.',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
        duration: const Duration(seconds: 10),
      );
    } finally {
      isProcessing.value = false;
    }
  }

  void navigateToHome() {
    Get.back();
    Get.back(); // Go back twice to reach home
  }

  void navigateToAttendanceLog() {
    Get.back();
    // Navigate to attendance screen
  }
}
