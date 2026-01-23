import 'package:get/get.dart';

import '../modules/apply_leave_screen/bindings/apply_leave_screen_binding.dart';
import '../modules/apply_leave_screen/views/apply_leave_screen_view.dart';
import '../modules/attendance_screen/bindings/attendance_screen_binding.dart';
import '../modules/attendance_screen/views/attendance_screen_view.dart';
import '../modules/home/bindings/home_binding.dart';
import '../modules/home/views/home_view.dart';
import '../modules/login_screen/bindings/login_screen_binding.dart';
import '../modules/login_screen/views/login_screen_view.dart';
import '../modules/face_attendance/bindings/face_attendance_binding.dart';
import '../modules/face_attendance/views/face_attendance_view.dart';
import '../modules/attendance_regularization/bindings/attendance_regularization_binding.dart';
import '../modules/attendance_regularization/views/attendance_regularization_view.dart';
import '../modules/attendance_regularization/views/new_regularization_request_view.dart';

part 'app_routes.dart';

class AppPages {
  AppPages._();

  static const INITIAL = Routes.LOGIN_SCREEN;

  static final routes = [
    GetPage(
      name: _Paths.HOME,
      page: () => const HomeView(),
      binding: HomeBinding(),
    ),
    GetPage(
      name: _Paths.LOGIN_SCREEN,
      page: () => const LoginScreenView(),
      binding: LoginScreenBinding(),
    ),
    GetPage(
      name: _Paths.ATTENDANCE_SCREEN,
      page: () => const AttendanceScreenView(),
      binding: AttendanceScreenBinding(),
    ),
    GetPage(
      name: _Paths.APPLY_LEAVE_SCREEN,
      page: () => const ApplyLeaveScreenView(),
      binding: ApplyLeaveScreenBinding(),
    ),
    GetPage(
      name: _Paths.FACE_ATTENDANCE,
      page: () => const FaceAttendanceView(),
      binding: FaceAttendanceBinding(),
    ),
    GetPage(
      name: _Paths.ATTENDANCE_REGULARIZATION,
      page: () => const AttendanceRegularizationView(),
      binding: AttendanceRegularizationBinding(),
    ),
    GetPage(
      name: _Paths.NEW_REGULARIZATION_REQUEST,
      page: () => const NewRegularizationRequestView(),
      binding: AttendanceRegularizationBinding(),
    ),
  ];
}
