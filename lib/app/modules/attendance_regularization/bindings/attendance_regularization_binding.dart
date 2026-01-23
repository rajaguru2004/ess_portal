import 'package:get/get.dart';
import '../controllers/attendance_regularization_controller.dart';

class AttendanceRegularizationBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<AttendanceRegularizationController>(
      () => AttendanceRegularizationController(),
    );
  }
}
