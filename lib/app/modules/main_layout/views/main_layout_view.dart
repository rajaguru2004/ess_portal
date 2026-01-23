import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_nav_bar/google_nav_bar.dart';

import '../../home/views/home_view.dart';
import '../../attendance_screen/views/attendance_screen_view.dart';
import '../../apply_leave_screen/views/apply_leave_screen_view.dart';
import '../../attendance_regularization/views/attendance_regularization_view.dart';
import '../controllers/main_layout_controller.dart';

class MainLayoutView extends GetView<MainLayoutController> {
  const MainLayoutView({super.key});

  @override
  Widget build(BuildContext context) {
    // Define the pages for each tab (4 tabs only, notifications removed)
    final List<Widget> pages = [
      const HomeView(),
      const AttendanceScreenView(),
      const ApplyLeaveScreenView(),
      const AttendanceRegularizationView(),
    ];

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      body: Obx(
        () => AnimatedSwitcher(
          duration: const Duration(milliseconds: 300),
          switchInCurve: Curves.easeInOut,
          switchOutCurve: Curves.easeInOut,
          child: pages[controller.selectedIndex],
        ),
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          boxShadow: [
            BoxShadow(
              blurRadius: 20,
              color: Theme.of(context).brightness == Brightness.dark
                  ? Colors.black.withOpacity(0.3)
                  : Colors.black.withOpacity(0.1),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 12),
            child: Obx(
              () => GNav(
                rippleColor: Theme.of(context).brightness == Brightness.dark
                    ? Colors.grey[700]!
                    : Colors.grey[300]!,
                hoverColor: Theme.of(context).brightness == Brightness.dark
                    ? Colors.grey[800]!
                    : Colors.grey[100]!,
                gap: 8,
                activeColor: Theme.of(context).colorScheme.primary,
                iconSize: 24,
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 12,
                ),
                duration: const Duration(milliseconds: 400),
                tabBackgroundColor: Theme.of(
                  context,
                ).colorScheme.primary.withOpacity(0.1),
                color: Theme.of(context).brightness == Brightness.dark
                    ? Colors.grey[400]
                    : Colors.grey[600],
                tabs: const [
                  GButton(icon: Icons.home, text: 'Home'),
                  GButton(icon: Icons.calendar_today, text: 'Attendance'),
                  GButton(icon: Icons.umbrella, text: 'Leave'),
                  GButton(icon: Icons.lock_clock, text: 'Regularize'),
                ],
                selectedIndex: controller.selectedIndex,
                onTabChange: (index) {
                  controller.changeTabIndex(index);
                },
              ),
            ),
          ),
        ),
      ),
    );
  }
}
