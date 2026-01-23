import 'package:flutter/material.dart';
import '../controllers/manager_requests_controller.dart';

class RequestCardWidget extends StatelessWidget {
  final ManagerRequest request;
  final bool isSelected;
  final VoidCallback onToggleSelection;
  final VoidCallback? onApprove;
  final VoidCallback? onReject;

  const RequestCardWidget({
    super.key,
    required this.request,
    required this.isSelected,
    required this.onToggleSelection,
    this.onApprove,
    this.onReject,
  });

  @override
  Widget build(BuildContext context) {
    final isPending = request.status.toLowerCase() == 'pending';

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isSelected
              ? Theme.of(context).colorScheme.primary
              : Theme.of(context).dividerColor.withOpacity(0.2),
          width: isSelected ? 2 : 1,
        ),
      ),
      child: Column(
        children: [
          // Main content
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Checkbox
                if (isPending)
                  Checkbox(
                    value: isSelected,
                    onChanged: (_) => onToggleSelection(),
                    activeColor: Theme.of(context).colorScheme.primary,
                  ),
                if (isPending) const SizedBox(width: 8),

                // Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Name and date
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              request.employeeName,
                              style: Theme.of(context).textTheme.titleMedium
                                  ?.copyWith(fontWeight: FontWeight.bold),
                            ),
                          ),
                          Icon(
                            Icons.keyboard_arrow_down,
                            color: Theme.of(context).colorScheme.onSurface,
                            size: 20,
                          ),
                        ],
                      ),

                      const SizedBox(height: 4),

                      // Date and leave type
                      Row(
                        children: [
                          Text(
                            request.formattedDate,
                            style: Theme.of(context).textTheme.bodySmall
                                ?.copyWith(
                                  color: Theme.of(
                                    context,
                                  ).textTheme.bodySmall?.color,
                                ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            '|',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: _getLeaveTypeColor(
                                request.leaveType,
                              ).withOpacity(0.1),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              request.leaveType,
                              style: Theme.of(context).textTheme.bodySmall
                                  ?.copyWith(
                                    color: _getLeaveTypeColor(
                                      request.leaveType,
                                    ),
                                    fontWeight: FontWeight.w600,
                                  ),
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

          // Action buttons (only for pending requests)
          if (isPending && onApprove != null && onReject != null)
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: onReject,
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Theme.of(
                          context,
                        ).colorScheme.onSurface,
                        side: BorderSide(color: Theme.of(context).dividerColor),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      child: const Text('Reject'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: onApprove,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context).colorScheme.primary,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      child: const Text('Approve'),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Color _getLeaveTypeColor(String leaveType) {
    switch (leaveType.toLowerCase()) {
      case 'special leave':
        return Colors.purple;
      case 'casual leave':
        return Colors.blue;
      case 'sick leave':
        return Colors.orange;
      case 'missing punch':
        return Colors.red;
      case 'incorrect time':
        return Colors.amber;
      case 'extra hours':
      case 'weekend work':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }
}
