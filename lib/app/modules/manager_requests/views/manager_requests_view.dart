import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/manager_requests_controller.dart';
import '../widgets/request_card_widget.dart';

class ManagerRequestsView extends GetView<ManagerRequestsController> {
  const ManagerRequestsView({super.key});

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
            // Tab bar
            _buildTabBar(context),

            // Request type filters
            _buildRequestTypeFilters(context),

            const SizedBox(height: 12),

            // Requests list
            Expanded(child: _buildRequestsList(context)),
          ],
        );
      }),
      // Floating action buttons for bulk actions
      floatingActionButton: Obx(() {
        if (controller.selectedRequestIds.isEmpty) {
          return const SizedBox.shrink();
        }

        return _buildBulkActionButtons(context);
      }),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
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
      title: Text(
        'Requests',
        style: Theme.of(
          context,
        ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
      ),
      actions: [
        // Select All checkbox
        Obx(
          () => Row(
            children: [
              Checkbox(
                value: controller.selectAllEnabled.value,
                onChanged: (_) => controller.toggleSelectAll(),
                activeColor: Theme.of(context).colorScheme.primary,
              ),
              Text('Select All', style: Theme.of(context).textTheme.bodySmall),
            ],
          ),
        ),
        const SizedBox(width: 8),
        IconButton(
          icon: Icon(
            Icons.search,
            color: Theme.of(context).colorScheme.onSurface,
          ),
          onPressed: () {
            // TODO: Implement search
          },
        ),
        IconButton(
          icon: Icon(
            Icons.filter_list,
            color: Theme.of(context).colorScheme.onSurface,
          ),
          onPressed: () {
            // TODO: Implement advanced filters
          },
        ),
      ],
    );
  }

  Widget _buildTabBar(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        border: Border(
          bottom: BorderSide(
            color: Theme.of(context).dividerColor.withOpacity(0.2),
          ),
        ),
      ),
      child: Obx(
        () => Row(
          children: [
            _buildTabItem(context, 'Pending', controller.pendingCount.value, 0),
            const SizedBox(width: 24),
            _buildTabItem(
              context,
              'Approved',
              controller.approvedCount.value,
              1,
            ),
            const SizedBox(width: 24),
            _buildTabItem(
              context,
              'Rejected',
              controller.rejectedCount.value,
              2,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTabItem(
    BuildContext context,
    String label,
    int count,
    int index,
  ) {
    final isSelected = controller.selectedTab.value == index;

    return GestureDetector(
      onTap: () => controller.changeTab(index),
      child: Column(
        children: [
          Text(
            '$label ($count)',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: isSelected
                  ? Theme.of(context).colorScheme.primary
                  : Theme.of(context).textTheme.bodyMedium?.color,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            ),
          ),
          const SizedBox(height: 8),
          Container(
            height: 3,
            width: 60,
            decoration: BoxDecoration(
              color: isSelected
                  ? Theme.of(context).colorScheme.primary
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRequestTypeFilters(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Obx(
        () => SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              _buildFilterChip(context, 'Attendance', Icons.calendar_today),
              const SizedBox(width: 8),
              _buildFilterChip(context, 'Over Time', Icons.access_time),
              const SizedBox(width: 8),
              _buildFilterChip(context, 'Leave', Icons.umbrella),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFilterChip(BuildContext context, String label, IconData icon) {
    final type = label.toLowerCase().replaceAll(' ', '');
    final isSelected = controller.selectedRequestType.value == type;

    return FilterChip(
      label: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 16,
            color: isSelected
                ? Theme.of(context).colorScheme.primary
                : Theme.of(context).textTheme.bodyMedium?.color,
          ),
          const SizedBox(width: 6),
          Text(label),
        ],
      ),
      selected: isSelected,
      onSelected: (selected) {
        controller.filterByRequestType(selected ? type : 'all');
      },
      selectedColor: Theme.of(context).colorScheme.primary.withOpacity(0.1),
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
  }

  Widget _buildRequestsList(BuildContext context) {
    return Obx(() {
      final requests = controller.filteredRequests;

      if (requests.isEmpty) {
        return Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.inbox_outlined,
                size: 64,
                color: Theme.of(context).textTheme.bodySmall?.color,
              ),
              const SizedBox(height: 16),
              Text(
                'No requests found',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: Theme.of(context).textTheme.bodySmall?.color,
                ),
              ),
            ],
          ),
        );
      }

      return ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: requests.length,
        itemBuilder: (context, index) {
          final request = requests[index];
          final isSelected = controller.isRequestSelected(request.id);

          return RequestCardWidget(
            request: request,
            isSelected: isSelected,
            onToggleSelection: () =>
                controller.toggleRequestSelection(request.id),
            onApprove: request.status.toLowerCase() == 'pending'
                ? () => controller.approveRequest(request.id)
                : null,
            onReject: request.status.toLowerCase() == 'pending'
                ? () => controller.rejectRequest(request.id)
                : null,
          );
        },
      );
    });
  }

  Widget _buildBulkActionButtons(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Theme.of(context).colorScheme.primary.withOpacity(0.3),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Expanded(
            child: OutlinedButton(
              onPressed: controller.rejectBulkRequests,
              style: OutlinedButton.styleFrom(
                foregroundColor: Theme.of(context).colorScheme.onSurface,
                side: BorderSide(
                  color: Theme.of(context).colorScheme.onSurface,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('Reject'),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: ElevatedButton(
              onPressed: controller.approveBulkRequests,
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('Approve'),
            ),
          ),
        ],
      ),
    );
  }
}
