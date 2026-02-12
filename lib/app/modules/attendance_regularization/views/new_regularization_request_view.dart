import 'package:ess_portal/app/theme/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../controllers/attendance_regularization_controller.dart';

class NewRegularizationRequestView
    extends GetView<AttendanceRegularizationController> {
  const NewRegularizationRequestView({super.key});

  @override
  Widget build(BuildContext context) {
    final reasonController = TextEditingController();
    final selectedDate = DateTime.now().obs;
    final selectedType = 'Missing Punch'.obs;
    final selectedTime = TimeOfDay.now().obs;

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: AppBar(
        title: AppText(
          'New Regularization Request',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: false,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Request Type
            AppText(
              'Request Type',
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Obx(
              () => Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: Theme.of(context).dividerColor.withOpacity(0.2),
                  ),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: selectedType.value,
                    isExpanded: true,
                    items: controller.requestTypes.map((type) {
                      return DropdownMenuItem(
                        value: type,
                        child: AppText(type),
                      );
                    }).toList(),
                    onChanged: (value) {
                      if (value != null) selectedType.value = value;
                    },
                  ),
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Date Selection
            AppText(
              'Date',
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Obx(
              () => InkWell(
                onTap: () async {
                  final date = await showDatePicker(
                    context: context,
                    initialDate: selectedDate.value,
                    firstDate: DateTime.now().subtract(
                      const Duration(days: 30),
                    ),
                    lastDate: DateTime.now(),
                  );
                  if (date != null) selectedDate.value = date;
                },
                child: Container(
                  padding: const EdgeInsets.all(16),
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
                      AppText(
                        DateFormat('MMM dd, yyyy').format(selectedDate.value),
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                      const Icon(Icons.calendar_today),
                    ],
                  ),
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Time Selection
            AppText(
              'Requested Time',
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Obx(
              () => InkWell(
                onTap: () async {
                  final time = await showTimePicker(
                    context: context,
                    initialTime: selectedTime.value,
                  );
                  if (time != null) selectedTime.value = time;
                },
                child: Container(
                  padding: const EdgeInsets.all(16),
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
                      AppText(
                        selectedTime.value.format(context),
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                      const Icon(Icons.access_time),
                    ],
                  ),
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Reason
            AppText(
              'Reason',
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: reasonController,
              maxLines: 5,
              decoration: InputDecoration(
                hintText: 'Explain the reason for your request...',
                filled: true,
                fillColor: Theme.of(context).colorScheme.surface,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(
                    color: Theme.of(context).dividerColor.withOpacity(0.2),
                  ),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(
                    color: Theme.of(context).dividerColor.withOpacity(0.2),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 32),

            // Submit Button
            ElevatedButton(
              onPressed: () {
                if (reasonController.text.isEmpty) {
                  Get.snackbar(
                    'Error',
                    'Please enter a reason',
                    snackPosition: SnackPosition.BOTTOM,
                  );
                  return;
                }

                // TODO: Submit to API
                Get.snackbar(
                  'Success',
                  'Request submitted successfully',
                  snackPosition: SnackPosition.BOTTOM,
                  backgroundColor: Colors.green,
                  colorText: Colors.white,
                );
                Get.back();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF2563EB),
                minimumSize: const Size(double.infinity, 56),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: AppText(
                'Submit Request',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
