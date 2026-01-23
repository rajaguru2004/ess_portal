import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:intl/intl.dart';
import '../controllers/apply_leave_screen_controller.dart';

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
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildLabel("Leave Type*", context),
            const SizedBox(height: 8),
            _buildLeaveTypeDropdown(context),
            const SizedBox(height: 24),
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
            const Spacer(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Get.snackbar("Success", "Leave request submitted");
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: colorScheme.primary,
                  foregroundColor: colorScheme.onPrimary,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  "Apply Leave",
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLabel(String text, BuildContext context) {
    final theme = Theme.of(context);
    // Check if it has asterisk
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
          child: DropdownButton<String>(
            value: controller.leaveType.value,
            isExpanded: true,
            icon: Icon(Icons.keyboard_arrow_down, color: theme.iconTheme.color),
            dropdownColor: colorScheme.surface,
            style: theme.textTheme.bodyLarge,
            items: controller.leaveTypes.map((String value) {
              return DropdownMenuItem<String>(value: value, child: Text(value));
            }).toList(),
            onChanged: controller.setLeaveType,
          ),
        ),
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
            // Header
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
            // Date Displays
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
                              Icons.cancel_outlined,
                              size: 20,
                              color: theme.iconTheme.color?.withOpacity(0.5),
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
                              Icons.cancel_outlined,
                              size: 20,
                              color: theme.iconTheme.color?.withOpacity(0.5),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Calendar
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
                  headerStyle: HeaderStyle(
                    formatButtonVisible: false,
                    titleCentered: true,
                    titleTextStyle:
                        theme.textTheme.titleLarge ??
                        const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  calendarStyle: CalendarStyle(
                    defaultTextStyle: TextStyle(color: colorScheme.onSurface),
                    weekendTextStyle: TextStyle(color: colorScheme.onSurface),
                    outsideTextStyle: TextStyle(
                      color: colorScheme.onSurface.withOpacity(0.3),
                    ),
                    todayDecoration: BoxDecoration(
                      color: colorScheme.primary,
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

            // Footer info
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              color: colorScheme.surface,
              child: Row(
                children: [
                  Icon(
                    Icons.calendar_today,
                    size: 16,
                    color: theme.iconTheme.color?.withOpacity(0.7),
                  ),
                  const SizedBox(width: 8),
                  Obx(
                    () => Text(
                      controller.durationString,
                      style: theme.textTheme.bodyMedium,
                    ),
                  ),
                ],
              ),
            ),

            // Buttons
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Get.back(),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        side: BorderSide(color: colorScheme.primary),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        "Cancel",
                        style: TextStyle(
                          color: colorScheme.primary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: controller.applyDateSelection,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: colorScheme.primary,
                        foregroundColor: colorScheme.onPrimary,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        "Select",
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ),
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
