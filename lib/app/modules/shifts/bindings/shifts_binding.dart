import 'package:get/get.dart';
import '../controllers/shifts_controller.dart';

class ShiftsBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<ShiftsController>(() => ShiftsController());
  }
}
