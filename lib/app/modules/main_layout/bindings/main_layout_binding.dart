import 'package:get/get.dart';

import '../controllers/main_layout_controller.dart';
import '../../home/controllers/home_controller.dart';
import '../../attendance_screen/controllers/attendance_screen_controller.dart';
import '../../apply_leave_screen/controllers/apply_leave_screen_controller.dart';
import '../../attendance_regularization/controllers/attendance_regularization_controller.dart';
import '../../shifts/controllers/shifts_controller.dart';

class MainLayoutBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<MainLayoutController>(() => MainLayoutController());

    // Initialize all child module controllers
    Get.lazyPut<HomeController>(() => HomeController());
    Get.lazyPut<AttendanceScreenController>(() => AttendanceScreenController());
    Get.lazyPut<ShiftsController>(() => ShiftsController());
    Get.lazyPut<ApplyLeaveScreenController>(() => ApplyLeaveScreenController());
    Get.lazyPut<AttendanceRegularizationController>(
      () => AttendanceRegularizationController(),
    );
  }
}
