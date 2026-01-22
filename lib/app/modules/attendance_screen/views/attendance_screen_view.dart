import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/attendance_screen_controller.dart';
import '../widgets/donut_chart_widget.dart';
import '../../../routes/app_pages.dart';

class AttendanceScreenView extends GetView<AttendanceScreenController> {
  const AttendanceScreenView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      body: SafeArea(
        child: Obx(() {
          if (controller.isLoading.value) {
            return const Center(child: CircularProgressIndicator());
          }

          return Column(
            children: [
              // Scrollable content
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header
                      _buildHeader(context),

                      const SizedBox(height: 16),

                      // Date Selector
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: _buildDateSelector(context),
                      ),

                      const SizedBox(height: 16),

                      // Shift Selector
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: _buildShiftSelector(context),
                      ),

                      const SizedBox(height: 24),

                      // Attendance Card
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: _buildAttendanceCard(context),
                      ),

                      const SizedBox(height: 24),

                      // Employee Details Section
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: _buildEmployeeDetailsSection(context),
                      ),

                      const SizedBox(height: 100), // Space for bottom nav
                    ],
                  ),
                ),
              ),

              // Bottom Navigation
              _buildBottomNavigation(context),
            ],
          );
        }),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Icon(Icons.menu, color: Theme.of(context).colorScheme.onBackground),
          const SizedBox(width: 16),
          Obx(
            () => Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  controller.userName.value,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'ID: ${controller.employeeId.value}',
                  style: Theme.of(
                    context,
                  ).textTheme.bodySmall?.copyWith(color: Colors.grey),
                ),
              ],
            ),
          ),
          const Spacer(),
          IconButton(
            icon: const Icon(Icons.add_circle_outline, color: Colors.blue),
            onPressed: () => Get.toNamed(Routes.APPLY_LEAVE_SCREEN),
          ),
        ],
      ),
    );
  }

  Widget _buildDateSelector(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Theme.of(context).dividerColor.withOpacity(0.2),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Previous arrow
          InkWell(
            onTap: controller.goToPreviousDay,
            child: Icon(
              Icons.chevron_left,
              color: Theme.of(context).colorScheme.primary,
            ),
          ),

          // Date display
          Obx(
            () => Text(
              controller.selectedDateString.value,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Theme.of(context).colorScheme.primary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),

          // Next arrow
          InkWell(
            onTap: controller.goToNextDay,
            child: Icon(
              Icons.chevron_right,
              color: Theme.of(context).colorScheme.primary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildShiftSelector(BuildContext context) {
    return Obx(
      () => Row(
        children: controller.availableShifts.map((shift) {
          final isSelected = controller.currentShift.value == shift;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: InkWell(
              onTap: () => controller.selectShift(shift),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: isSelected
                      ? Theme.of(context).colorScheme.primary.withOpacity(0.1)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: isSelected
                        ? Theme.of(context).colorScheme.primary
                        : Colors.grey.shade300,
                  ),
                ),
                child: Text(
                  shift,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: isSelected
                        ? Theme.of(context).colorScheme.primary
                        : Colors.grey,
                    fontWeight: isSelected
                        ? FontWeight.w600
                        : FontWeight.normal,
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildAttendanceCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Attendance',
            style: Theme.of(
              context,
            ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 24),

          // Donut Chart
          Center(
            child: Obx(
              () => DonutChartWidget(
                total: controller.totalDays.value,
                segments: [
                  DonutChartSegment(
                    value: controller.presentCount.value.toDouble(),
                    color: const Color(0xFF3B82F6), // Blue
                    label: 'Present',
                  ),
                  DonutChartSegment(
                    value: controller.lateCount.value.toDouble(),
                    color: const Color(0xFF06B6D4), // Cyan
                    label: 'Late',
                  ),
                  DonutChartSegment(
                    value: controller.absentCount.value.toDouble(),
                    color: const Color(0xFFFBBF24), // Yellow
                    label: 'Absent',
                  ),
                  DonutChartSegment(
                    value: controller.leaveCount.value.toDouble(),
                    color: const Color(0xFFEF4444), // Red
                    label: 'Leave',
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 24),

          // Stats Cards
          Obx(
            () => Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    context,
                    'Present',
                    controller.presentCount.value,
                    const Color(0xFF3B82F6),
                    true,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildStatCard(
                    context,
                    'Late',
                    controller.lateCount.value,
                    const Color(0xFF06B6D4),
                    false,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildStatCard(
                    context,
                    'Absent',
                    controller.absentCount.value,
                    const Color(0xFFFBBF24),
                    false,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildStatCard(
                    context,
                    'Leave',
                    controller.leaveCount.value,
                    const Color(0xFFEF4444),
                    false,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(
    BuildContext context,
    String label,
    int count,
    Color color,
    bool isHighlighted,
  ) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      decoration: BoxDecoration(
        color: isHighlighted ? color.withOpacity(0.05) : Colors.transparent,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isHighlighted ? color : Colors.grey.shade200,
          width: isHighlighted ? 2 : 1,
        ),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(color: color, shape: BoxShape.circle),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: Theme.of(context).textTheme.bodySmall,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Text(
            count.toString(),
            style: Theme.of(
              context,
            ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget _buildEmployeeDetailsSection(BuildContext context) {
    return Column(
      children: [
        // Header
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Employee Details',
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
            ),
            InkWell(
              onTap: controller.navigateToBreakHours,
              child: Row(
                children: [
                  Text(
                    'Break Hours',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Icon(
                    Icons.chevron_right,
                    size: 16,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                ],
              ),
            ),
          ],
        ),

        const SizedBox(height: 16),

        // Employee List
        Obx(
          () => Column(
            children: controller.employeeDetails.map((employee) {
              return _buildEmployeeItem(context, employee);
            }).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildEmployeeItem(BuildContext context, employee) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: Theme.of(context).dividerColor.withOpacity(0.2),
          ),
        ),
        child: Row(
          children: [
            // Avatar
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Text(
                  employee.initial,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: Theme.of(context).colorScheme.primary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),

            const SizedBox(width: 12),

            // Name
            Expanded(
              child: Text(
                employee.name,
                style: Theme.of(
                  context,
                ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w500),
              ),
            ),

            // Status badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: employee.statusColorValue.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                employee.status,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: employee.statusColorValue,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),

            const SizedBox(width: 12),

            // Time
            Text(employee.time, style: Theme.of(context).textTheme.bodyMedium),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomNavigation(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        border: Border(
          top: BorderSide(
            color: Theme.of(context).dividerColor.withOpacity(0.2),
          ),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          InkWell(
            onTap: () => Get.back(),
            child: Icon(
              Icons.home_outlined,
              color: Theme.of(context).colorScheme.primary,
              size: 28,
            ),
          ),
          Icon(
            Icons.description_outlined,
            color: Theme.of(context).iconTheme.color?.withOpacity(0.5),
            size: 24,
          ),
          Icon(
            Icons.people_outline,
            color: Theme.of(context).iconTheme.color?.withOpacity(0.5),
            size: 24,
          ),
        ],
      ),
    );
  }
}
