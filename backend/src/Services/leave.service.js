const { prisma } = require('../Prisma/client');

/**
 * Leave Service
 * Handles leave application, balance calculation, and validation
 */

/**
 * Check if a date is a weekend (Saturday or Sunday)
 */
const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};

/**
 * Get holidays in a date range
 */
const getHolidaysInRange = async (startDate, endDate, tenantId, branchId) => {
    const holidays = await prisma.holiday.findMany({
        where: {
            tenantId,
            OR: [
                { branchId: branchId },
                { branchId: null } // Organization-wide holidays
            ],
            date: {
                gte: startDate,
                lte: endDate
            }
        }
    });

    return holidays.map(h => h.date);
};

/**
 * Calculate leave days excluding weekends and holidays
 */
const calculateLeaveDays = async (startDate, endDate, halfDayType, tenantId, branchId) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates
    if (start > end) {
        throw new Error('Start date cannot be after end date');
    }

    // Half day validation
    if (halfDayType && start.getTime() !== end.getTime()) {
        throw new Error('Half day leave must be for a single day');
    }

    // If half day, return 0.5
    if (halfDayType) {
        return 0.5;
    }

    // Get holidays in range
    const holidays = await getHolidaysInRange(start, end, tenantId, branchId);
    const holidayDates = new Set(holidays.map(h => h.toDateString()));

    // Count working days
    let workingDays = 0;
    const current = new Date(start);

    while (current <= end) {
        const isHoliday = holidayDates.has(current.toDateString());
        const isWeekendDay = isWeekend(current);

        if (!isHoliday && !isWeekendDay) {
            workingDays++;
        }

        current.setDate(current.getDate() + 1);
    }

    return workingDays;
};

/**
 * Check for overlapping leaves
 */
const checkOverlappingLeave = async (userId, startDate, endDate, excludeId = null) => {
    const where = {
        userId,
        status: {
            in: ['PENDING', 'APPROVED']
        },
        NOT: {
            OR: [
                { endDate: { lt: startDate } },
                { startDate: { gt: endDate } }
            ]
        }
    };

    if (excludeId) {
        where.id = { not: excludeId };
    }

    const overlapping = await prisma.leaveApplication.findFirst({ where });

    return overlapping;
};

/**
 * Check if user has attendance for dates in range
 */
const checkAttendanceConflict = async (userId, startDate, endDate) => {
    const attendance = await prisma.attendance.findFirst({
        where: {
            userId,
            date: {
                gte: startDate,
                lte: endDate
            },
            status: {
                not: 'PENDING'
            }
        }
    });

    return attendance;
};

/**
 * Get leave balance for user, leave type, and year
 */
const getLeaveBalance = async (userId, leaveTypeId, year) => {
    let balance = await prisma.leaveBalance.findUnique({
        where: {
            userId_leaveTypeId_year: {
                userId,
                leaveTypeId,
                year
            }
        }
    });

    // If balance doesn't exist, initialize it
    if (!balance) {
        balance = await initializeBalanceForUserAndType(userId, leaveTypeId, year);
    }

    return balance;
};

/**
 * Initialize balance for a user and leave type
 */
const initializeBalanceForUserAndType = async (userId, leaveTypeId, year) => {
    // Get user's role
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { Role: true }
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Get role leave policy
    const policy = await prisma.roleLeavePolicy.findUnique({
        where: {
            roleId_leaveTypeId: {
                roleId: user.roleId,
                leaveTypeId
            }
        }
    });

    if (!policy) {
        throw new Error('No leave policy found for this role and leave type');
    }

    // Create balance
    const balance = await prisma.leaveBalance.create({
        data: {
            userId,
            leaveTypeId,
            year,
            allocated: policy.annualQuota,
            used: 0,
            carryForward: 0
        }
    });

    return balance;
};

/**
 * Calculate available balance (allocated + carryForward - used - pending)
 */
const calculateAvailableBalance = async (userId, leaveTypeId, year) => {
    const balance = await getLeaveBalance(userId, leaveTypeId, year);

    // Calculate pending leaves
    const pendingLeaves = await prisma.leaveApplication.aggregate({
        where: {
            userId,
            leaveTypeId,
            year,
            status: 'PENDING'
        },
        _sum: {
            totalDays: true
        }
    });

    const pending = pendingLeaves._sum.totalDays || 0;
    const available = balance.allocated + balance.carryForward - balance.used - pending;

    return {
        allocated: balance.allocated,
        carryForward: balance.carryForward,
        used: balance.used,
        pending,
        available
    };
};

/**
 * Validate leave application
 */
const validateLeaveApplication = async (userId, leaveData) => {
    const { leaveTypeId, startDate, endDate, halfDayType } = leaveData;

    // Get user details
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new Error('User not found');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if dates are in past
    if (start < today) {
        throw new Error('Cannot apply leave for past dates');
    }

    // Check year boundary
    if (start.getFullYear() !== end.getFullYear()) {
        throw new Error('Leave cannot span across different years');
    }

    // Check overlapping leaves
    const overlapping = await checkOverlappingLeave(userId, start, end);
    if (overlapping) {
        throw new Error('You already have a leave application for overlapping dates');
    }

    // Check attendance conflict
    const attendanceConflict = await checkAttendanceConflict(userId, start, end);
    if (attendanceConflict) {
        throw new Error('Cannot apply leave for dates with existing attendance');
    }

    // Calculate leave days
    const totalDays = await calculateLeaveDays(start, end, halfDayType, user.tenantId, user.branchId);

    // Check balance
    const year = start.getFullYear();
    const balanceInfo = await calculateAvailableBalance(userId, leaveTypeId, year);

    if (balanceInfo.available < totalDays) {
        throw new Error(`Insufficient leave balance. Available: ${balanceInfo.available}, Requested: ${totalDays}`);
    }

    return { totalDays, year };
};

/**
 * Determine current approver based on hierarchy
 * @param {string} userId - ID of the user applying for leave
 * @returns {Promise<string|null>} - ID of the approver or null
 */
const determineApprover = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            isHeadManager: true,
            managerId: true,
            tenantId: true
        }
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Case 1: Head Manager applies leave → Admin approves
    if (user.isHeadManager) {
        // Find an admin user from the same tenant
        const admin = await prisma.user.findFirst({
            where: {
                tenantId: user.tenantId,
                Role: {
                    code: 'ADMIN'
                }
            },
            select: { id: true }
        });

        if (!admin) {
            throw new Error('No admin found to approve head manager leave');
        }

        return admin.id;
    }

    // Case 2: Regular Employee or Manager applies → Direct manager approves
    if (user.managerId) {
        return user.managerId;
    }

    // Case 3: No manager assigned
    throw new Error('No reporting manager assigned. Cannot apply for leave.');
};

/**
 * Apply for leave
 */
const applyLeave = async (userId, leaveData) => {
    const { leaveTypeId, startDate, endDate, halfDayType, reason } = leaveData;

    // Validate application
    const { totalDays, year } = await validateLeaveApplication(userId, leaveData);

    // Determine approver based on hierarchy
    const currentApproverId = await determineApprover(userId);

    // Create leave application
    const leaveApplication = await prisma.leaveApplication.create({
        data: {
            userId,
            leaveTypeId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            halfDayType: halfDayType || null,
            totalDays,
            reason,
            year,
            status: 'PENDING',
            currentApproverId  // Set the approver
        },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    employeeCode: true
                }
            },
            leaveType: {
                select: {
                    id: true,
                    name: true,
                    code: true
                }
            }
        }
    });

    return leaveApplication;
};

/**
 * Get employee's leaves
 */
const getMyLeaves = async (userId, filters = {}) => {
    const where = { userId };

    if (filters.status) {
        where.status = filters.status;
    }

    if (filters.year) {
        where.year = parseInt(filters.year);
    }

    if (filters.leaveTypeId) {
        where.leaveTypeId = filters.leaveTypeId;
    }

    const leaves = await prisma.leaveApplication.findMany({
        where,
        include: {
            leaveType: {
                select: {
                    id: true,
                    name: true,
                    code: true
                }
            }
        },
        orderBy: {
            appliedAt: 'desc'
        }
    });

    return leaves;
};

/**
 * Cancel leave
 */
const cancelLeave = async (leaveApplicationId, userId) => {
    // Get leave application
    const leave = await prisma.leaveApplication.findUnique({
        where: { id: leaveApplicationId }
    });

    if (!leave) {
        throw new Error('Leave application not found');
    }

    // Check ownership
    if (leave.userId !== userId) {
        throw new Error('You can only cancel your own leave');
    }

    // Check status
    if (leave.status === 'CANCELLED') {
        throw new Error('Leave is already cancelled');
    }

    if (leave.status === 'REJECTED') {
        throw new Error('Cannot cancel a rejected leave');
    }

    // Check if leave has started
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(leave.startDate);

    if (startDate < today) {
        throw new Error('Cannot cancel leave that has already started');
    }

    // Use transaction to cancel leave and restore balance
    const result = await prisma.$transaction(async (tx) => {
        // Update leave status
        const updatedLeave = await tx.leaveApplication.update({
            where: { id: leaveApplicationId },
            data: {
                status: 'CANCELLED',
                cancelledAt: new Date(),
                cancelledBy: userId
            }
        });

        // If leave was approved, restore balance
        if (leave.status === 'APPROVED') {
            await tx.leaveBalance.updateMany({
                where: {
                    userId: leave.userId,
                    leaveTypeId: leave.leaveTypeId,
                    year: leave.year
                },
                data: {
                    used: {
                        decrement: leave.totalDays
                    }
                }
            });

            // Delete attendance records
            await tx.attendance.deleteMany({
                where: {
                    leaveApplicationId: leave.id
                }
            });
        }

        return updatedLeave;
    });

    return result;
};

/**
 * Get all leave balances for a user
 */
const getAllBalances = async (userId, year) => {
    // Get user's role
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { Role: true }
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Get all leave types with policies for this role
    const policies = await prisma.roleLeavePolicy.findMany({
        where: {
            roleId: user.roleId,
            isActive: true
        },
        include: {
            leaveType: true
        }
    });

    // Get balances for each leave type
    const balances = await Promise.all(
        policies.map(async (policy) => {
            const balanceInfo = await calculateAvailableBalance(userId, policy.leaveTypeId, year);
            return {
                leaveTypeId: policy.leaveTypeId,
                leaveType: policy.leaveType,
                ...balanceInfo
            };
        })
    );

    return balances;
};

module.exports = {
    applyLeave,
    getMyLeaves,
    cancelLeave,
    getLeaveBalance,
    getAllBalances,
    calculateAvailableBalance,
    validateLeaveApplication,
    calculateLeaveDays,
    checkOverlappingLeave,
    determineApprover
};
