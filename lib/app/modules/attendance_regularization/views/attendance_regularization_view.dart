import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/attendance_regularization_controller.dart';

class AttendanceRegularizationView
    extends GetView<AttendanceRegularizationController> {
  const AttendanceRegularizationView({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Scaffold(
      backgroundColor: colorScheme.background,
      body: SafeArea(
        child: Column(
          children: [
            // Custom Header with Back Button
            _buildHeader(context),

            const SizedBox(height: 16),

            // Scrollable Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  children: [
                    // User Profile Section
                    _buildUserProfile(context),

                    const SizedBox(height: 20),

                    // Filter Dropdown
                    _buildFilterDropdown(context),

                    const SizedBox(height: 16),

                    // Stats Row
                    _buildStatsRow(context),

                    const SizedBox(height: 24),

                    // Requests List
                    Obx(() => _buildRequestsList(context)),

                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Row(
        children: [
          InkWell(
            onTap: () => Get.back(),
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Theme.of(context).colorScheme.surface,
              ),
              child: Icon(
                Icons.chevron_left,
                color: Theme.of(context).colorScheme.onSurface,
              ),
            ),
          ),
          const Expanded(
            child: Center(
              child: Text(
                'Attendance Request',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ),
          ),
          // Placeholder for right action if any, otherwise empty container to balance center text
          const SizedBox(width: 40),
        ],
      ),
    );
  }

  Widget _buildUserProfile(BuildContext context) {
    // Using first request data for user info or fallback
    return Obx(() {
      final String name = controller.pendingRequests.isNotEmpty
          ? controller.pendingRequests.first.employeeName
          : (controller.approvedRequests.isNotEmpty
                ? controller.approvedRequests.first.employeeName
                : 'Roger Cunningham'); // Fallback to screenshot name
      final String id = controller.pendingRequests.isNotEmpty
          ? controller.pendingRequests.first.employeeId
          : (controller.approvedRequests.isNotEmpty
                ? controller.approvedRequests.first.employeeId
                : '12345');

      return Row(
        children: [
          Container(
            padding: const EdgeInsets.all(2),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.blue.withOpacity(0.3), width: 2),
            ),
            child: CircleAvatar(
              radius: 24,
              backgroundColor: Colors.blue.shade100,
              child: Text(
                name.isNotEmpty ? name[0] : 'U',
                style: TextStyle(
                  color: Colors.blue.shade800,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Text(
            '$name (#$id)',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
          ),
        ],
      );
    });
  }

  Widget _buildFilterDropdown(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isDark ? Colors.grey.shade700 : Colors.grey.shade300,
            ),
          ),
          child: Row(
            children: [
              Text(
                'Last 30 Days',
                style: TextStyle(
                  color: theme.colorScheme.onSurface.withOpacity(0.7),
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(width: 8),
              Icon(
                Icons.keyboard_arrow_down,
                color: theme.colorScheme.onSurface.withOpacity(0.6),
              ),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.all(10),
          decoration: const BoxDecoration(
            color: Color(0xFF3B82F6), // Blue
            shape: BoxShape.circle,
          ),
          child: const Icon(
            Icons.chat_bubble_outline,
            color: Colors.white,
            size: 20,
          ),
        ),
      ],
    );
  }

  Widget _buildStatsRow(BuildContext context) {
    return Obx(
      () => Row(
        children: [
          _buildStatItem(
            context,
            'Approved',
            controller.approvedRequests.length.toString(),
          ),
          _buildStatItem(
            context,
            'Pending',
            controller.pendingRequests.length.toString(),
          ),
          _buildStatItem(
            context,
            'Rejected',
            controller.rejectedRequests.length.toString(),
          ),
          _buildStatItem(
            context,
            'Processing',
            '1',
          ), // Dummy for now as not in JSON
        ],
      ),
    );
  }

  Widget _buildStatItem(BuildContext context, String label, String count) {
    return Expanded(
      child: Column(
        children: [
          Text(
            label,
            style: TextStyle(
              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            count,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
              color: Theme.of(context).colorScheme.onBackground,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRequestsList(BuildContext context) {
    // Merging all requests and sorting by date for the list view
    // For now showing pending items first as in screenshot
    final requests = [...controller.pendingRequests];

    if (requests.isEmpty) {
      // Show some approved/rejected if no pending
      requests.addAll(controller.approvedRequests);
      requests.addAll(controller.rejectedRequests);
    }

    // Fallback if absolutely no data
    if (requests.isEmpty) {
      return Center(
        child: Text(
          "No requests found",
          style: TextStyle(
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
          ),
        ),
      );
    }

    return ListView.separated(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      itemCount: requests.length,
      separatorBuilder: (context, index) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        return _buildRequestCard(context, requests[index]);
      },
    );
  }

  Widget _buildRequestCard(BuildContext context, AttendanceRequest request) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final secondaryTextColor = theme.colorScheme.onSurface.withOpacity(0.7);

    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header: Link to Regularization / Type
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Manual Attendance', // Could be request type
                  style: TextStyle(
                    color: Colors.indigo.shade400,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  'Processing', // Mapping status to UI text
                  style: TextStyle(
                    color: Colors.blue.shade400,
                    fontWeight: FontWeight.w600,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),

          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              request.formattedDate, // "22/07/2024"
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: Text(
              'Created at: ${request.formattedSubmittedOn}',
              style: TextStyle(color: secondaryTextColor, fontSize: 12),
            ),
          ),

          const SizedBox(height: 16),

          // Shift Info
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            color: isDark
                ? Colors.blue.shade900.withOpacity(0.3)
                : Colors.blue.shade50,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Day Shift',
                  style: TextStyle(
                    color: Colors.blue.shade400,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '9:00 am - 6:00 pm',
                  style: TextStyle(
                    color: theme.colorScheme.onSurface,
                    fontWeight: FontWeight.w500,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Check-in / Check-out Row
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Check-in',
                        style: TextStyle(
                          color: secondaryTextColor,
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Text(
                            '11:00 AM',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              decoration: TextDecoration.lineThrough,
                              color: secondaryTextColor,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Icon(
                            Icons.arrow_right_alt,
                            size: 16,
                            color: secondaryTextColor,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            request.requestedTime,
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Check-out',
                        style: TextStyle(
                          color: secondaryTextColor,
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Text(
                            '8:00 PM',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              decoration: TextDecoration.lineThrough,
                              color: secondaryTextColor,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Icon(
                            Icons.arrow_right_alt,
                            size: 16,
                            color: secondaryTextColor,
                          ),
                          const SizedBox(width: 4),
                          const Text(
                            '6:00 PM',
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Reason
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Reason',
                  style: TextStyle(
                    color: secondaryTextColor,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  request.reason,
                  style: TextStyle(
                    color: theme.colorScheme.onSurface,
                    fontSize: 14,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),
          const Divider(),
          const SizedBox(height: 8),

          // Line Manager Section
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.green, width: 2),
                  ),
                  child: const Icon(Icons.check, size: 12, color: Colors.green),
                ),
                const SizedBox(width: 8),
                Text(
                  'Line Manager',
                  style: TextStyle(
                    color: Colors.green,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Spacer(),
                Text(
                  'Jul 26, 2024, 3:14 PM', // Dummy timestamp
                  style: TextStyle(color: secondaryTextColor, fontSize: 12),
                ),
                const SizedBox(width: 4),
                Icon(
                  Icons.keyboard_arrow_down,
                  size: 16,
                  color: secondaryTextColor,
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Actions
          if (request.status.toLowerCase() == 'pending') ...[
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'You are Recommending as a Line Manager',
                    style: TextStyle(color: secondaryTextColor, fontSize: 12),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => controller.rejectRequest(request.id),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: Colors.red,
                            side: const BorderSide(color: Colors.red),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: Text(
                            'Reject',
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () =>
                              controller.approveRequest(request.id),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF10B981), // Green
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: Text(
                            'Recommend',
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
          const SizedBox(height: 8),
        ],
      ),
    );
  }
}
