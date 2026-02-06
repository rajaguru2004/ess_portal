class Shift {
  final String id;
  final String name;
  final String type;
  final String startTime;
  final String endTime;

  Shift({
    required this.id,
    required this.name,
    required this.type,
    required this.startTime,
    required this.endTime,
  });

  factory Shift.fromJson(Map<String, dynamic> json) {
    return Shift(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      type: json['type'] ?? '',
      startTime: json['startTime'] ?? '',
      endTime: json['endTime'] ?? '',
    );
  }
}

class TodayShiftResponse {
  final bool success;
  final String message;
  final TodayShiftData? data;

  TodayShiftResponse({required this.success, required this.message, this.data});

  factory TodayShiftResponse.fromJson(Map<String, dynamic> json) {
    return TodayShiftResponse(
      success: json['success'] ?? false,
      message: json['message'] ?? '',
      data: json['data'] != null ? TodayShiftData.fromJson(json['data']) : null,
    );
  }
}

class TodayShiftData {
  final String date;
  final List<Shift> shifts;

  TodayShiftData({required this.date, required this.shifts});

  factory TodayShiftData.fromJson(Map<String, dynamic> json) {
    var shiftsList = <Shift>[];
    if (json['shifts'] != null) {
      json['shifts'].forEach((v) {
        shiftsList.add(Shift.fromJson(v));
      });
    }
    return TodayShiftData(date: json['date'] ?? '', shifts: shiftsList);
  }
}

class UpcomingShiftResponse {
  final bool success;
  final String message;
  final List<UpcomingShiftItem>? data;

  UpcomingShiftResponse({
    required this.success,
    required this.message,
    this.data,
  });

  factory UpcomingShiftResponse.fromJson(Map<String, dynamic> json) {
    var dataList = <UpcomingShiftItem>[];
    if (json['data'] != null) {
      json['data'].forEach((v) {
        dataList.add(UpcomingShiftItem.fromJson(v));
      });
    }
    return UpcomingShiftResponse(
      success: json['success'] ?? false,
      message: json['message'] ?? '',
      data: dataList,
    );
  }
}

class UpcomingShiftItem {
  final String date;
  final Shift shift;

  UpcomingShiftItem({required this.date, required this.shift});

  factory UpcomingShiftItem.fromJson(Map<String, dynamic> json) {
    return UpcomingShiftItem(
      date: json['date'] ?? '',
      shift: Shift.fromJson(json['shift'] ?? {}),
    );
  }
}
