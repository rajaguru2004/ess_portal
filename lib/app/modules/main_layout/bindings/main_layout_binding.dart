import 'package:get/get.dart';

import '../controllers/main_layout_controller.dart';
import '../../home/bindings/home_binding.dart';
import '../../attendance_screen/bindings/attendance_screen_binding.dart';
import '../../apply_leave_screen/bindings/apply_leave_screen_binding.dart';
import '../../attendance_regularization/bindings/attendance_regularization_binding.dart';

class MainLayoutBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<MainLayoutController>(() => MainLayoutController());

    // Initialize all child module controllers
    HomeBinding().dependencies();
    AttendanceScreenBinding().dependencies();
    ApplyLeaveScreenBinding().dependencies();
    AttendanceRegularizationBinding().dependencies();
  }
}
