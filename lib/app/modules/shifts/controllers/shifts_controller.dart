import 'package:get/get.dart';
import '../../../data/providers/shift_provider.dart';
import '../../../data/models/shift_model.dart';

class ShiftsController extends GetxController {
  final ShiftProvider _shiftProvider = ShiftProvider();

  final todayShifts = <Shift>[].obs;
  final upcomingShifts = <UpcomingShiftItem>[].obs;
  final isLoading = false.obs;

  @override
  void onInit() {
    super.onInit();
    fetchShifts();
  }

  Future<void> fetchShifts() async {
    isLoading.value = true;
    try {
      final todayResponse = await _shiftProvider.getTodayShifts();
      if (todayResponse.success && todayResponse.data != null) {
        todayShifts.value = todayResponse.data!.shifts;
      }

      final upcomingResponse = await _shiftProvider.getUpcomingShifts();
      if (upcomingResponse.success && upcomingResponse.data != null) {
        upcomingShifts.value = upcomingResponse.data!;
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to fetch shifts: $e');
    } finally {
      isLoading.value = false;
    }
  }
}
