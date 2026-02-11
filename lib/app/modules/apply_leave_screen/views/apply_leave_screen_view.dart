import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:intl/intl.dart';
import '../controllers/apply_leave_screen_controller.dart';
import '../../../data/models/leave_model.dart';

class ApplyLeaveScreenView extends GetView<ApplyLeaveScreenController> {
  const ApplyLeaveScreenView({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text('Apply Leave', style: theme.textTheme.titleLarge),
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: theme.iconTheme.color),
          onPressed: () => Get.back(),
        ),
        backgroundColor: theme.appBarTheme.backgroundColor,
        elevation: 0,
        centerTitle: false,
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }

        return SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildLabel("Leave Type*", context),
              const SizedBox(height: 8),
              _buildLeaveTypeDropdown(context),
              const SizedBox(height: 8),
              _buildAvailableBalance(context),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildLabel("Start Date*", context),
                        const SizedBox(height: 8),
                        _buildDateField(context, true),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildLabel("End Date*", context),
                        const SizedBox(height: 8),
                        _buildDateField(context, false),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              _buildLabel("Reason*", context),
              const SizedBox(height: 8),
              _buildReasonField(context),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: Obx(
                  () => ElevatedButton(
                    onPressed: controller.isApplying.value
                        ? null
                        : controller.applyLeave,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: colorScheme.primary,
                      foregroundColor: colorScheme.onPrimary,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: controller.isApplying.value
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2,
                            ),
                          )
                        : Text(
                            "Apply Leave",
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                  ),
                ),
              ),
              const SizedBox(height: 32),
              Text(
                "My Leaves",
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              _buildLeavesHistory(context),
            ],
          ),
        );
      }),
    );
  }

  Widget _buildLabel(String text, BuildContext context) {
    final theme = Theme.of(context);
    if (text.endsWith('*')) {
      return RichText(
        text: TextSpan(
          text: text.substring(0, text.length - 1),
          style: TextStyle(
            color: theme.colorScheme.onSurface.withOpacity(0.6),
            fontSize: 14,
          ),
          children: [
            TextSpan(
              text: '*',
              style: TextStyle(color: theme.colorScheme.error, fontSize: 14),
            ),
          ],
        ),
      );
    }
    return Text(
      text,
      style: TextStyle(
        color: theme.colorScheme.onSurface.withOpacity(0.6),
        fontSize: 14,
      ),
    );
  }

  Widget _buildLeaveTypeDropdown(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Obx(
      () => Container(
        padding: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          color: colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: theme.dividerTheme.color ?? colorScheme.outline,
          ),
        ),
        child: DropdownButtonHideUnderline(
          child: DropdownButton<LeaveBalance>(
            value: controller.selectedLeaveBalance.value,
            isExpanded: true,
            icon: Icon(Icons.keyboard_arrow_down, color: theme.iconTheme.color),
            dropdownColor: colorScheme.surface,
            style: theme.textTheme.bodyLarge,
            items: controller.leaveBalances.map((LeaveBalance balance) {
              return DropdownMenuItem<LeaveBalance>(
                value: balance,
                child: Text(balance.leaveType.name),
              );
            }).toList(),
            onChanged: controller.setLeaveType,
          ),
        ),
      ),
    );
  }

  Widget _buildAvailableBalance(BuildContext context) {
    final theme = Theme.of(context);
    return Obx(() {
      final balance = controller.selectedLeaveBalance.value;
      if (balance == null) return const SizedBox.shrink();
      return Text(
        "Available: ${balance.available} days (Pending: ${balance.pending})",
        style: theme.textTheme.bodySmall?.copyWith(
          color: theme.colorScheme.primary,
        ),
      );
    });
  }

  Widget _buildReasonField(BuildContext context) {
    final theme = Theme.of(context);
    return TextField(
      controller: controller.reasonController,
      maxLines: 3,
      decoration: InputDecoration(
        hintText: "Enter reason for leave",
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        filled: true,
        fillColor: theme.colorScheme.surface,
      ),
    );
  }

  Widget _buildDateField(BuildContext context, bool isStart) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return GestureDetector(
      onTap: () => _showDateSelectionModal(context),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
        decoration: BoxDecoration(
          color: colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: theme.dividerTheme.color ?? colorScheme.outline,
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Obx(
              () => Text(
                isStart
                    ? controller.formattedStartDate
                    : controller.formattedEndDate,
                style: theme.textTheme.bodyLarge,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLeavesHistory(BuildContext context) {
    final theme = Theme.of(context);
    return Obx(() {
      if (controller.myLeaves.isEmpty) {
        return const Center(child: Text("No leave history found"));
      }
      return ListView.separated(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: controller.myLeaves.length,
        separatorBuilder: (context, index) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final leave = controller.myLeaves[index];
          return Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: theme.colorScheme.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: theme.dividerColor.withOpacity(0.1)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      leave.leaveType?.name ?? "Leave Application",
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    _buildStatusBadge(leave.status),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  "${DateFormat('dd MMM').format(leave.startDate)} - ${DateFormat('dd MMM yyyy').format(leave.endDate)} (${leave.totalDays} days)",
                  style: theme.textTheme.bodyMedium,
                ),
                Text(
                  "Applied at ${DateFormat('dd MMM, hh:mm a').format(leave.appliedAt)}",
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: Colors.grey,
                  ),
                ),
                if (leave.status == 'PENDING') ...[
                  const SizedBox(height: 8),
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: () => controller.cancelLeave(leave.id),
                      child: const Text(
                        "Cancel Request",
                        style: TextStyle(color: Colors.red),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          );
        },
      );
    });
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    switch (status) {
      case 'APPROVED':
        color = Colors.green;
        break;
      case 'PENDING':
        color = Colors.orange;
        break;
      case 'REJECTED':
        color = Colors.red;
        break;
      case 'CANCELLED':
        color = Colors.grey;
        break;
      default:
        color = Colors.blue;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        status,
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  void _showDateSelectionModal(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (modalContext) => Container(
        height: MediaQuery.of(context).size.height * 0.85,
        decoration: BoxDecoration(
          color: colorScheme.surface,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text("Select Date", style: theme.textTheme.titleLarge),
                  IconButton(
                    icon: Icon(Icons.close, color: theme.iconTheme.color),
                    onPressed: () => Get.back(),
                  ),
                ],
              ),
            ),
            Divider(height: 1, color: theme.dividerTheme.color),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        border: Border.all(
                          color:
                              theme.dividerTheme.color ?? colorScheme.outline,
                        ),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Obx(
                        () => Row(
                          children: [
                            Text(
                              DateFormat('EEE, dd MMM').format(
                                controller.rangeStart.value ?? DateTime.now(),
                              ),
                              style: theme.textTheme.bodyLarge?.copyWith(
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const Spacer(),
                            Icon(
                              Icons.calendar_today,
                              size: 16,
                              color: colorScheme.primary,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        border: Border.all(
                          color:
                              theme.dividerTheme.color ?? colorScheme.outline,
                        ),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Obx(
                        () => Row(
                          children: [
                            Text(
                              DateFormat('EEE, dd MMM').format(
                                controller.rangeEnd.value ??
                                    (controller.rangeStart.value ??
                                        DateTime.now()),
                              ),
                              style: theme.textTheme.bodyLarge?.copyWith(
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const Spacer(),
                            Icon(
                              Icons.calendar_today,
                              size: 16,
                              color: colorScheme.primary,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: Obx(
                () => TableCalendar(
                  firstDay: DateTime.utc(2020, 10, 16),
                  lastDay: DateTime.utc(2030, 3, 14),
                  focusedDay: controller.focusedDay.value,
                  rangeStartDay: controller.rangeStart.value,
                  rangeEndDay: controller.rangeEnd.value,
                  calendarFormat: CalendarFormat.month,
                  rangeSelectionMode: RangeSelectionMode.toggledOn,
                  onRangeSelected: (start, end, focusedDay) {
                    controller.updateDateRange(start, end, focusedDay);
                  },
                  onPageChanged: (focusedDay) {
                    controller.focusedDay.value = focusedDay;
                  },
                  headerStyle: const HeaderStyle(
                    formatButtonVisible: false,
                    titleCentered: true,
                  ),
                  calendarStyle: CalendarStyle(
                    todayDecoration: BoxDecoration(
                      color: colorScheme.primary.withOpacity(0.5),
                      shape: BoxShape.circle,
                    ),
                    selectedDecoration: BoxDecoration(
                      color: colorScheme.primary,
                      shape: BoxShape.circle,
                    ),
                    rangeStartDecoration: BoxDecoration(
                      color: colorScheme.primary,
                      shape: BoxShape.circle,
                    ),
                    rangeEndDecoration: BoxDecoration(
                      color: colorScheme.primary,
                      shape: BoxShape.circle,
                    ),
                    rangeHighlightColor: colorScheme.primary.withOpacity(0.2),
                  ),
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Obx(
                    () => Text(
                      controller.durationString,
                      style: theme.textTheme.bodyMedium,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => Get.back(),
                          child: const Text("Cancel"),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: controller.applyDateSelection,
                          child: const Text("Select"),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
