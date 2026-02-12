import 'package:get/get.dart';

import '../controllers/assign_employees_controller.dart';

class AssignEmployeesBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<AssignEmployeesController>(() => AssignEmployeesController());
  }
}
