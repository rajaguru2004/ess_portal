import 'dart:io';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:geolocator/geolocator.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

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
  String? capturedImagePath;

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
    try {
      isLoading.value = true;

      // Request permissions
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
      if (Platform.isAndroid) {
        final androidInfo = await deviceInfo.androidInfo;
        deviceId = androidInfo.id;
      } else if (Platform.isIOS) {
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
    if (cameraController == null || !cameraController!.value.isInitialized) {
      return;
    }

    try {
      isProcessing.value = true;

      // Capture image
      final image = await cameraController!.takePicture();
      capturedImagePath = image.path;

      // Refresh location before submission
      await getCurrentLocation();

      // Call API
      await uploadFaceAttendance();
    } catch (e) {
      Get.snackbar('Error', 'Failed to capture photo: $e');
      isProcessing.value = false;
    }
  }

  Future<void> uploadFaceAttendance() async {
    try {
      // Prepare metadata
      final metadata = {
        'employeeId': employeeId,
        'timestamp': DateTime.now().toIso8601String(),
        'latitude': currentPosition?.latitude ?? 0.0,
        'longitude': currentPosition?.longitude ?? 0.0,
        'deviceId': deviceId ?? 'unknown',
        'clockType': 'clock_in',
      };

      // TODO: Replace with actual API endpoint
      // For now, using dummy API call
      final dummyApiUrl = 'https://jsonplaceholder.typicode.com/posts';

      debugPrint('Uploading face attendance with metadata: $metadata');
      debugPrint('Image path: $capturedImagePath');

      // Simulate API call
      final response = await http.post(
        Uri.parse(dummyApiUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(metadata),
      );

      debugPrint('API Response Status: ${response.statusCode}');
      debugPrint('API Response Body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Success
        showSuccess.value = true;
        Get.snackbar(
          'Success',
          'Face attendance uploaded successfully',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.green,
          colorText: Colors.white,
        );
      } else {
        // Error
        Get.snackbar(
          'Error',
          'Failed to upload attendance. Please try again.',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
        );
      }
    } catch (e) {
      debugPrint('Upload error: $e');
      Get.snackbar(
        'Error',
        'Network error. Please check your connection.',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
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
