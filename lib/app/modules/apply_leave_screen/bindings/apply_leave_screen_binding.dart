import 'package:get/get.dart';
import '../controllers/apply_leave_screen_controller.dart';

class ApplyLeaveScreenBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<ApplyLeaveScreenController>(() => ApplyLeaveScreenController());
  }
}
