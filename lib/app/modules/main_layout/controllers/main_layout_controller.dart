import 'package:get/get.dart';
import '../../attendance_screen/controllers/attendance_screen_controller.dart';

class MainLayoutController extends GetxController {
  // Observable for current selected tab index
  final _selectedIndex = 0.obs;
  int get selectedIndex => _selectedIndex.value;

  // Update selected tab index
  void changeTabIndex(int index) {
    _selectedIndex.value = index;
    if (index == 1) {
      Get.find<AttendanceScreenController>().refreshData();
    }
  }

  @override
  void onInit() {
    super.onInit();
  }

  @override
  void onReady() {
    super.onReady();
  }

  @override
  void onClose() {
    super.onClose();
  }
}
