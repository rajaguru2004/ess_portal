import 'package:get/get.dart';

import '../controllers/manager_requests_controller.dart';

class ManagerRequestsBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<ManagerRequestsController>(() => ManagerRequestsController());
  }
}
