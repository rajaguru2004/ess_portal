// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
}

// Auth Types
export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    user: User;
}

export interface User {
    id: string;
    employeeCode: string;
    username: string;
    fullName: string;
    roleId: string;
    tenantId: string;
    firstLogin: boolean;
    email?: string;
    mobile?: string;
    branchId?: string;
    departmentId?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    Role?: {
        name: string;
    };
}



// Role Types
export interface Role {
    id: string;
    name: string;
    code: string;
    description: string;
    isSystemRole: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRoleRequest {
    name: string;
    code: string;
    description: string;
    isSystemRole: boolean;
}

// Department Types
export interface Department {
    id: string;
    tenantId: string;
    branchId: string;
    name: string;
    code: string;
    managerId: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDepartmentRequest {
    tenantId: string;
    branchId: string;
    name: string;
    code: string;
    managerId?: string | null;
}

// Shift Types
export interface Shift {
    id: string;
    tenantId: string;
    name: string;
    code: string;
    startTime: string;
    endTime: string;
    graceMinutes: number;
    breakMinutes: number;
    isRotational: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateShiftRequest {
    tenantId: string;
    name: string;
    code: string;
    startTime: string;
    endTime: string;
    graceMinutes: number;
    breakMinutes: number;
    isRotational: boolean;
}

// Leave Type Types
export interface LeaveType {
    id: string;
    tenantId: string;
    name: string;
    code: string;
    defaultDays: number;
    carryForwardAllowed: boolean;
    maxCarryForward: number;
    encashmentAllowed: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateLeaveTypeRequest {
    tenantId: string;
    name: string;
    code: string;
    defaultDays: number;
    carryForwardAllowed: boolean;
    maxCarryForward: number;
    encashmentAllowed: boolean;
}

// Holiday Types
export interface Holiday {
    id: string;
    tenantId: string;
    branchId: string | null;
    name: string;
    date: string;
    type: string;
    createdAt: string;
}

export interface CreateHolidayRequest {
    tenantId: string;
    branchId: string | null;
    name: string;
    date: string;
    type: string;
}

// Designation Types
export interface Designation {
    id: string;
    tenantId: string;
    name: string;
    code: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDesignationRequest {
    tenantId: string;
    name: string;
    code: string;
}

// Role Leave Policy Types
export interface RoleLeavePolicy {
    id: string;
    roleId: string;
    leaveTypeId: string;
    annualQuota: number;
    accrualType: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRoleLeavePolicyRequest {
    roleId: string;
    leaveTypeId: string;
    annualQuota: number;
    accrualType: string;
}

// User Management Types
export interface CreateUserRequest {
    employeeCode: string;
    username: string;
    password: string;
    fullName: string;
    email: string;
    mobile: string;
    tenantId: string;
    branchId: string;
    departmentId?: string | null;
    roleId: string;
    managerId?: string | null;
    isActive?: boolean;
}

// Attendance Types
export interface AttendanceLog {
    id: string;
    attendanceId: string;
    type: 'IN' | 'OUT';
    timestamp: string;
    latitude: string;
    longitude: string;
    photoUrl: string | null;
    deviceInfo?: string;
    ipAddress?: string;
    createdAt: string;
}

export interface Attendance {
    id: string;
    userId: string;
    date: string;
    shiftId: string | null;
    checkInAt: string;
    checkOutAt: string | null;
    status: 'CHECKED_IN' | 'CHECKED_OUT';
    isLate: boolean;
    workMinutes: number;
    geoMismatch: boolean;
    createdAt: string;
    updatedAt: string;
    logs: AttendanceLog[];
}

// Shift Assignment Types
export interface ShiftAssignment {
    id: string;
    userId: string;
    shiftId: string;
    date: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    requestedBy: string;
    approvedBy: string | null;
    approvedAt: string | null;
    rejectionReason: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateShiftAssignmentRequest {
    userId: string;
    shiftId: string;
    date: string;
}

export interface RejectShiftAssignmentRequest {
    reason: string;
}

// Leave Management Types
export interface LeaveRequest {
    id: string;
    userId: string;
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    halfDayType: string | null;
    totalDays: number;
    reason: string;
    year: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    appliedAt: string;
    approvedBy: string | null;
    approvedAt: string | null;
    rejectedBy: string | null;
    rejectedAt: string | null;
    rejectionReason: string | null;
    cancelledAt: string | null;
    cancelledBy: string | null;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        fullName: string;
        employeeCode: string;
        email?: string;
        designation?: string | null;
    };
    leaveType: {
        id: string;
        name: string;
        code: string;
    };
}

export interface RejectLeaveRequest {
    reason: string;
}

