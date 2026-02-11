import 'package:ess_portal/app/theme/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../controllers/shifts_controller.dart';
import '../../../data/models/shift_model.dart';

class ShiftsView extends GetView<ShiftsController> {
  const ShiftsView({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: Text(
            'My Shifts',
            style: GoogleFonts.montserrat(fontWeight: FontWeight.bold),
          ),
          centerTitle: true,
          bottom: TabBar(
            indicatorSize: TabBarIndicatorSize.tab,
            labelStyle: GoogleFonts.montserrat(fontWeight: FontWeight.bold),
            tabs: const [
              Tab(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.today_rounded, size: 18),
                    SizedBox(width: 8),
                    Text('Today'),
                  ],
                ),
              ),
              Tab(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.upcoming_outlined, size: 18),
                    SizedBox(width: 8),
                    Text('Upcoming'),
                  ],
                ),
              ),
            ],
          ),
        ),
        body: TabBarView(
          children: [_buildTodayShifts(context), _buildUpcomingShifts(context)],
        ),
      ),
    );
  }

  Widget _buildTodayShifts(BuildContext context) {
    return Obx(() {
      if (controller.isLoading.value) {
        return const Center(child: CircularProgressIndicator());
      }
      if (controller.todayShifts.isEmpty) {
        return _buildEmptyState(
          context,
          'No Shifts Today',
          'You don\'t have any shifts assigned for today.',
          Icons.free_breakfast_outlined,
        );
      }
      return ListView.separated(
        padding: const EdgeInsets.all(20),
        itemCount: controller.todayShifts.length,
        separatorBuilder: (_, __) => const SizedBox(height: 16),
        itemBuilder: (context, index) {
          final shift = controller.todayShifts[index];
          return _buildShiftCard(context, shift, null);
        },
      );
    });
  }

  Widget _buildUpcomingShifts(BuildContext context) {
    return Obx(() {
      if (controller.isLoading.value) {
        return const Center(child: CircularProgressIndicator());
      }
      if (controller.upcomingShifts.isEmpty) {
        return _buildEmptyState(
          context,
          'No Upcoming Shifts',
          'You don\'t have any upcoming shifts scheduled.',
          Icons.event_busy_rounded,
        );
      }
      return ListView.separated(
        padding: const EdgeInsets.all(20),
        itemCount: controller.upcomingShifts.length,
        separatorBuilder: (_, __) => const SizedBox(height: 16),
        itemBuilder: (context, index) {
          final item = controller.upcomingShifts[index];
          return _buildShiftCard(context, item.shift, item.date);
        },
      );
    });
  }

  Widget _buildEmptyState(
    BuildContext context,
    String title,
    String message,
    IconData icon,
  ) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.grey.shade50,
              shape: BoxShape.circle,
            ),
            child: Icon(icon, size: 48, color: Colors.grey.shade400),
          ),
          const SizedBox(height: 16),
          Text(
            title,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: Colors.grey.shade800,
            ),
          ),
          const SizedBox(height: 8),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Text(
              message,
              textAlign: TextAlign.center,
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(color: Colors.grey.shade600),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildShiftCard(BuildContext context, Shift shift, String? dateLabel) {
    final startTime = _formatTime(shift.startTime);
    final endTime = _formatTime(shift.endTime);
    final isMorning = startTime.toLowerCase().contains('am');
    final shiftColor = isMorning ? Colors.orange : Colors.indigo;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (dateLabel != null) ...[
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: 8),
            child: Text(
              _formatDate(dateLabel).toUpperCase(),
              style: Theme.of(context).textTheme.labelSmall?.copyWith(
                color: Colors.grey.shade600,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ),
          ),
        ],
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.shade200.withOpacity(0.5),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: Stack(
              children: [
                Positioned(
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 6,
                  child: Container(color: shiftColor),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(24, 20, 20, 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  shift.name,
                                  style: Theme.of(context).textTheme.titleMedium
                                      ?.copyWith(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 18,
                                      ),
                                ),
                                const SizedBox(height: 6),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 10,
                                    vertical: 4,
                                  ),
                                  decoration: BoxDecoration(
                                    color: shiftColor.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    shift.type,
                                    style: GoogleFonts.montserrat(
                                      color: shiftColor,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.grey.shade50,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Icon(
                              isMorning
                                  ? Icons.wb_sunny_rounded
                                  : Icons.nights_stay_rounded,
                              color: shiftColor,
                              size: 28,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      Row(
                        children: [
                          Expanded(
                            child: _buildTimeInfo(
                              context,
                              'Start Time',
                              startTime,
                              Icons.login_rounded,
                              Colors.green,
                            ),
                          ),
                          Container(
                            width: 1,
                            height: 32,
                            color: Colors.grey.shade200,
                          ),
                          Expanded(
                            child: _buildTimeInfo(
                              context,
                              'End Time',
                              endTime,
                              Icons.logout_rounded,
                              Colors.red,
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
        ),
      ],
    );
  }

  Widget _buildTimeInfo(
    BuildContext context,
    String label,
    String time,
    IconData icon,
    Color color,
  ) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, size: 16, color: color),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: Theme.of(
                  context,
                ).textTheme.labelSmall?.copyWith(color: Colors.grey.shade500),
                overflow: TextOverflow.ellipsis,
                maxLines: 1,
              ),
              Text(
                time,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Colors.grey.shade800,
                ),
                overflow: TextOverflow.ellipsis,
                maxLines: 1,
              ),
            ],
          ),
        ),
      ],
    );
  }

  String _formatTime(String isoString) {
    try {
      final dt = DateTime.parse(isoString).toLocal();
      return DateFormat('h:mm a').format(dt);
    } catch (e) {
      return isoString;
    }
  }

  String _formatDate(String dateStr) {
    try {
      final dt = DateTime.parse(dateStr);
      return DateFormat('EEEE, MMM d').format(dt);
    } catch (e) {
      return dateStr;
    }
  }
}
