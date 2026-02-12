import 'package:ess_portal/app/theme/app_text.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/attendance_detail_controller.dart';
import '../widgets/punch_entry_widget.dart';

class AttendanceDetailView extends GetView<AttendanceDetailController> {
  const AttendanceDetailView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: _buildAppBar(context),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }

        return Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    // Status badge
                    _buildStatusBadge(context),

                    const SizedBox(height: 16),

                    // Header (Type and Time)
                    _buildTableHeader(context),

                    // Punch entries
                    _buildPunchEntries(context),

                    const SizedBox(height: 24),

                    // Status toggle
                    _buildStatusToggle(context),

                    const SizedBox(height: 24),

                    // Summary
                    _buildSummary(context),

                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),

            // Action buttons
            _buildActionButtons(context),
          ],
        );
      }),
    );
  }

  PreferredSizeWidget _buildAppBar(BuildContext context) {
    return AppBar(
      backgroundColor: Theme.of(context).colorScheme.surface,
      elevation: 0,
      leading: IconButton(
        icon: Icon(
          Icons.arrow_back,
          color: Theme.of(context).colorScheme.onSurface,
        ),
        onPressed: () => Get.back(),
      ),
      title: Obx(
        () => Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AppText(
              controller.employeeName.value,
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
            ),
            AppText(
              'ID: ${controller.employeeId.value}',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Theme.of(context).textTheme.bodySmall?.color,
              ),
            ),
          ],
        ),
      ),
      actions: [
        IconButton(
          icon: Icon(
            Icons.edit_outlined,
            color: Theme.of(context).colorScheme.onSurface,
          ),
          onPressed: () {
            // Edit mode is already enabled
          },
        ),
      ],
    );
  }

  Widget _buildStatusBadge(BuildContext context) {
    return Obx(
      () => Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: controller.statusColor.withOpacity(0.1),
        ),
        child: Center(
          child: AppText(
            'Status: ${controller.statusLabel}',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: controller.statusColor,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTableHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface.withOpacity(0.5),
        border: Border(
          bottom: BorderSide(
            color: Theme.of(context).dividerColor.withOpacity(0.2),
          ),
        ),
      ),
      child: Row(
        children: [
          SizedBox(
            width: 72,
            child: AppText(
              'Type',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Theme.of(context).textTheme.bodySmall?.color,
              ),
            ),
          ),
          Expanded(
            child: AppText(
              'Time',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Theme.of(context).textTheme.bodySmall?.color,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPunchEntries(BuildContext context) {
    return Obx(
      () => Column(
        children: List.generate(controller.punchEntries.length, (index) {
          final entry = controller.punchEntries[index];
          final breakTime = controller.getBreakTime(index);

          return PunchEntryWidget(
            entry: entry,
            onEdit: () => controller.editPunchTime(index),
            breakTime: breakTime.isNotEmpty ? breakTime : null,
          );
        }),
      ),
    );
  }

  Widget _buildStatusToggle(BuildContext context) {
    return Obx(
      () => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Wrap(
          spacing: 8,
          children: controller.statusOptions.map((option) {
            final value = option['value']!;
            final label = option['label']!;
            final isSelected = controller.status.value == value;

            return ChoiceChip(
              label: AppText(label),
              selected: isSelected,
              onSelected: (selected) {
                if (selected) {
                  controller.changeStatus(value);
                }
              },
              selectedColor: Theme.of(
                context,
              ).colorScheme.primary.withOpacity(0.2),
              labelStyle: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: isSelected
                    ? Theme.of(context).colorScheme.primary
                    : Theme.of(context).textTheme.bodyMedium?.color,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
              ),
              side: BorderSide(
                color: isSelected
                    ? Theme.of(context).colorScheme.primary
                    : Theme.of(context).dividerColor,
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildSummary(BuildContext context) {
    return Obx(
      () => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          children: [
            _buildSummaryRow(
              context,
              'Total Working Time',
              controller.totalWorkingTime.value,
            ),
            const SizedBox(height: 12),
            _buildSummaryRow(
              context,
              'Total Break Time',
              controller.totalBreakTime.value,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow(BuildContext context, String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        AppText(
          label,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            color: Theme.of(context).textTheme.bodyMedium?.color,
          ),
        ),
        AppText(
          value,
          style: Theme.of(
            context,
          ).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold),
        ),
      ],
    );
  }

  Widget _buildActionButtons(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Save Changes button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: controller.saveChanges,
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const AppText('Save Changes'),
            ),
          ),

          const SizedBox(height: 12),

          // Cancel button
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: controller.cancel,
              style: OutlinedButton.styleFrom(
                foregroundColor: Theme.of(context).colorScheme.onSurface,
                side: BorderSide(color: Theme.of(context).dividerColor),
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const AppText('Cancel'),
            ),
          ),
        ],
      ),
    );
  }
}
