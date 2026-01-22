import 'package:flutter/material.dart';

import 'package:get/get.dart';

import '../controllers/attendance_screen_controller.dart';

class AttendanceScreenView extends GetView<AttendanceScreenController> {
  const AttendanceScreenView({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AttendanceScreenView'),
        centerTitle: true,
      ),
      body: const Center(
        child: Text(
          'AttendanceScreenView is working',
          style: TextStyle(fontSize: 20),
        ),
      ),
    );
  }
}
