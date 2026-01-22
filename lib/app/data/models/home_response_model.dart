/// Home response model aggregating all dashboard data
class HomeResponse {
  final String status;
  final String message;
  final HomeData data;

  HomeResponse({
    required this.status,
    required this.message,
    required this.data,
  });

  factory HomeResponse.fromJson(Map<String, dynamic> json) {
    return HomeResponse(
      status: json['status'] as String,
      message: json['message'] as String,
      data: HomeData.fromJson(json['data'] as Map<String, dynamic>),
    );
  }
}

class HomeData {
  final User user;
  final Shift shift;
  final Attendance attendance;
  final List<Activity> activities;

  HomeData({
    required this.user,
    required this.shift,
    required this.attendance,
    required this.activities,
  });

  factory HomeData.fromJson(Map<String, dynamic> json) {
    return HomeData(
      user: User.fromJson(json['user'] as Map<String, dynamic>),
      shift: Shift.fromJson(json['shift'] as Map<String, dynamic>),
      attendance: Attendance.fromJson(
        json['attendance'] as Map<String, dynamic>,
      ),
      activities: (json['activities'] as List<dynamic>)
          .map((e) => Activity.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

class User {
  final String name;
  final String employeeId;
  final String designation;

  User({
    required this.name,
    required this.employeeId,
    required this.designation,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      name: json['name'] as String,
      employeeId: json['employeeId'] as String,
      designation: json['designation'] as String,
    );
  }
}

class Shift {
  final String startTime;
  final String endTime;
  final String overtime;

  Shift({
    required this.startTime,
    required this.endTime,
    required this.overtime,
  });

  factory Shift.fromJson(Map<String, dynamic> json) {
    return Shift(
      startTime: json['startTime'] as String,
      endTime: json['endTime'] as String,
      overtime: json['overtime'] as String,
    );
  }
}

class Attendance {
  final WorkingHours workingHours;
  final TotalBreakTime totalBreakTime;

  Attendance({required this.workingHours, required this.totalBreakTime});

  factory Attendance.fromJson(Map<String, dynamic> json) {
    return Attendance(
      workingHours: WorkingHours.fromJson(
        json['workingHours'] as Map<String, dynamic>,
      ),
      totalBreakTime: TotalBreakTime.fromJson(
        json['totalBreakTime'] as Map<String, dynamic>,
      ),
    );
  }
}

class WorkingHours {
  final int hours;
  final int minutes;
  final int seconds;

  WorkingHours({
    required this.hours,
    required this.minutes,
    required this.seconds,
  });

  factory WorkingHours.fromJson(Map<String, dynamic> json) {
    return WorkingHours(
      hours: json['hours'] as int,
      minutes: json['minutes'] as int,
      seconds: json['seconds'] as int,
    );
  }
}

class TotalBreakTime {
  final int hours;
  final int minutes;

  TotalBreakTime({required this.hours, required this.minutes});

  factory TotalBreakTime.fromJson(Map<String, dynamic> json) {
    return TotalBreakTime(
      hours: json['hours'] as int,
      minutes: json['minutes'] as int,
    );
  }
}

class Activity {
  final String type;
  final String? time;
  final String? duration;
  final bool isBreak;

  Activity({
    required this.type,
    this.time,
    this.duration,
    required this.isBreak,
  });

  factory Activity.fromJson(Map<String, dynamic> json) {
    return Activity(
      type: json['type'] as String,
      time: json['time'] as String?,
      duration: json['duration'] as String?,
      isBreak: json['isBreak'] as bool? ?? false,
    );
  }
}
