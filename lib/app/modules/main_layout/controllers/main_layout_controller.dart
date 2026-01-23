import 'package:get/get.dart';

class MainLayoutController extends GetxController {
  // Observable for current selected tab index
  final _selectedIndex = 0.obs;
  int get selectedIndex => _selectedIndex.value;

  // Update selected tab index
  void changeTabIndex(int index) {
    _selectedIndex.value = index;
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
