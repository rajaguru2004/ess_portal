import 'dart:math';
import 'package:ess_portal/app/theme/app_text.dart';
import 'package:flutter/material.dart';

class DonutChartWidget extends StatelessWidget {
  final int total;
  final List<DonutChartSegment> segments;
  final double size;
  final double strokeWidth;

  const DonutChartWidget({
    super.key,
    required this.total,
    required this.segments,
    this.size = 200,
    this.strokeWidth = 30,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Donut Chart
          CustomPaint(
            size: Size(size, size),
            painter: DonutChartPainter(
              segments: segments,
              strokeWidth: strokeWidth,
            ),
          ),
          // Center Text
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              AppText(
                'Total',
                style: Theme.of(
                  context,
                ).textTheme.bodySmall?.copyWith(color: Colors.grey),
              ),
              const SizedBox(height: 4),
              AppText(
                total.toString(),
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class DonutChartSegment {
  final double value;
  final Color color;
  final String label;

  DonutChartSegment({
    required this.value,
    required this.color,
    required this.label,
  });
}

class DonutChartPainter extends CustomPainter {
  final List<DonutChartSegment> segments;
  final double strokeWidth;

  DonutChartPainter({required this.segments, required this.strokeWidth});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width - strokeWidth) / 2;
    final rect = Rect.fromCircle(center: center, radius: radius);

    // Calculate total value
    final totalValue = segments.fold<double>(
      0,
      (sum, segment) => sum + segment.value,
    );

    double startAngle = -pi / 2; // Start from top

    for (final segment in segments) {
      if (segment.value > 0 && totalValue > 0) {
        final sweepAngle = (segment.value / totalValue) * 2 * pi;

        final paint = Paint()
          ..color = segment.color
          ..style = PaintingStyle.stroke
          ..strokeWidth = strokeWidth
          ..strokeCap = StrokeCap.round;

        canvas.drawArc(rect, startAngle, sweepAngle, false, paint);

        startAngle += sweepAngle;
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}
