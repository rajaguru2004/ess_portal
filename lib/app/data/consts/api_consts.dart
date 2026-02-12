class ApiConsts {
  // Use 10.0.2.2 for Android emulator to access localhost
  // static const String baseUrl = 'https://api.ess.develop.thefusionapps.com';
  static const String baseUrl = 'http://192.168.0.109:3000';
}

class ApiEndpoints {
  // Auth
  static const String login = '/api/v1/auth/login';
  static const String changePassword = '/api/v1/auth/change-password';

  // User Management
  static const String users = '/api/v1/users';

  // Role Management
  static const String roles = '/api/v1/roles';

  // Department Management
  static const String departments = '/api/v1/departments';

  // Shift Management
  static const String shifts = '/api/v1/shifts';
  static const String shiftsToday = '/api/v1/employee/shifts/today';
  static const String shiftsUpcoming = '/api/v1/employee/shifts/upcoming';

  // Leave Type Management
  static const String leaveTypes = '/api/v1/leave-types';

  // Role Leave Policy Management
  static const String roleLeavePolicies = '/api/v1/role-leave-policies';

  // Holiday Management
  static const String holidays = '/api/v1/holidays';

  // Designation Management
  static const String designations = '/api/v1/designations';

  // Attendance Management
  static const String checkIn = '/api/v1/attendance/check-in';
  static const String checkOut = '/api/v1/attendance/check-out';
  static const String attendanceLogs = '/api/v1/attendance/logs';
  static const String attendanceStatus = '/api/v1/attendance/status';
  static const String attendanceHistory = '/api/v1/attendance/history';

  // Leave Management
  static const String applyLeave = '/api/v1/leave/apply';
  static const String myLeaves = '/api/v1/leave/my-leaves';
  static const String leaveBalance = '/api/v1/leave/balance';
  static const String cancelLeave = '/api/v1/leave/{id}/cancel';

  // Manager Management
  static const String makeManager = '/api/v1/users/{id}/make-manager';
  static const String managers = '/api/v1/users/managers';
  static const String userHierarchy = '/api/v1/users/{id}/hierarchy';
  static const String assignManager =
      '/api/v1/users/{employeeId}/assign-manager';
}
