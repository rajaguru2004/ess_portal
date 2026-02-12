import 'package:ess_portal/app/theme/app_text.dart';
import 'package:flutter/material.dart';
import '../controllers/attendance_detail_controller.dart';

class PunchEntryWidget extends StatelessWidget {
  final PunchEntry entry;
  final VoidCallback onEdit;
  final String? breakTime;

  const PunchEntryWidget({
    super.key,
    required this.entry,
    required this.onEdit,
    this.breakTime,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Punch entry row
        Container(
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            border: Border(
              bottom: BorderSide(
                color: Theme.of(context).dividerColor.withOpacity(0.1),
              ),
            ),
          ),
          child: Row(
            children: [
              // Type icon
              Icon(
                entry.icon,
                size: 20,
                color: Theme.of(context).textTheme.bodyMedium?.color,
              ),
              const SizedBox(width: 12),

              // Type label
              SizedBox(
                width: 40,
                child: AppText(
                  entry.label,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ),

              const SizedBox(width: 24),

              // Time with dotted line
              Expanded(
                child: Row(
                  children: [
                    AppText(
                      entry.time,
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(width: 8),
                    // Dotted line
                    if (entry.type == 'in')
                      Expanded(
                        child: CustomPaint(
                          painter: DottedLinePainter(
                            color: Theme.of(
                              context,
                            ).dividerColor.withOpacity(0.5),
                          ),
                          size: const Size(double.infinity, 1),
                        ),
                      ),
                  ],
                ),
              ),

              const SizedBox(width: 12),

              // Edit button
              IconButton(
                icon: Icon(
                  Icons.info_outline,
                  size: 20,
                  color: Theme.of(context).textTheme.bodyMedium?.color,
                ),
                onPressed: onEdit,
              ),
            ],
          ),
        ),

        // Break time display
        if (breakTime != null && breakTime!.isNotEmpty)
          Container(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: AppText(
              'Break Time: $breakTime',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Theme.of(context).textTheme.bodySmall?.color,
              ),
            ),
          ),
      ],
    );
  }
}

class DottedLinePainter extends CustomPainter {
  final Color color;

  DottedLinePainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 1
      ..style = PaintingStyle.stroke;

    const dashWidth = 5.0;
    const dashSpace = 3.0;
    double startX = 0;

    while (startX < size.width) {
      canvas.drawLine(
        Offset(startX, size.height / 2),
        Offset(startX + dashWidth, size.height / 2),
        paint,
      );
      startX += dashWidth + dashSpace;
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}
