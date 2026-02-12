import 'package:get/get.dart';

import '../controllers/make_manager_controller.dart';

class MakeManagerBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<MakeManagerController>(() => MakeManagerController());
  }
}
