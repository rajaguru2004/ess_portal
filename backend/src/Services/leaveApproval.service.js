const { prisma } = require('../Prisma/client');
const { calculateAvailableBalance } = require('./leave.service');

/**
 * Leave Approval Service
 * Handles manager approval/rejection workflow
 */

/**
 * Get pending leave approvals for a manager
 */
const getPendingApprovals = async (managerId, filters = {}) => {
    // Get manager details
    const manager = await prisma.user.findUnique({
        where: { id: managerId },
        select: { departmentId: true }
    });

    if (!manager) {
        throw new Error('Manager not found');
    }

    // Build query
    const where = {
        status: 'PENDING',
        user: {
            departmentId: manager.departmentId
        }
    };

    if (filters.leaveTypeId) {
        where.leaveTypeId = filters.leaveTypeId;
    }

    if (filters.year) {
        where.year = parseInt(filters.year);
    }

    // Get pending leaves from same department
    const pendingLeaves = await prisma.leaveApplication.findMany({
        where,
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    employeeCode: true,
                    email: true,
                    designation: true
                }
            },
            leaveType: {
                select: {
                    id: true,
                    name: true,
                    code: true
                }
            }
        },
        orderBy: {
            appliedAt: 'asc'
        }
    });

    return pendingLeaves;
};

/**
 * Create attendance records for approved leave
 */
const createLeaveAttendance = async (leaveApplication, tx) => {
    const { userId, startDate, endDate, id: leaveApplicationId } = leaveApplication;

    // Get user details for tenantId and branchId
    const user = await tx.user.findUnique({
        where: { id: userId }
    });

    // Get holidays in range
    const holidays = await tx.holiday.findMany({
        where: {
            tenantId: user.tenantId,
            OR: [
                { branchId: user.branchId },
                { branchId: null }
            ],
            date: {
                gte: startDate,
                lte: endDate
            }
        }
    });

    const holidayDates = new Set(holidays.map(h => h.date.toDateString()));

    // Create attendance for each working day
    const attendanceRecords = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
        const day = current.getDay();
        const isWeekend = day === 0 || day === 6;
        const isHoliday = holidayDates.has(current.toDateString());

        if (!isWeekend && !isHoliday) {
            attendanceRecords.push({
                userId,
                date: new Date(current),
                status: 'ON_LEAVE',
                leaveApplicationId
            });
        }

        current.setDate(current.getDate() + 1);
    }

    // Create all attendance records
    if (attendanceRecords.length > 0) {
        await tx.attendance.createMany({
            data: attendanceRecords
        });
    }

    return attendanceRecords.length;
};

/**
 * Approve leave application
 */
const approveLeave = async (leaveApplicationId, managerId) => {
    // Get leave application
    const leave = await prisma.leaveApplication.findUnique({
        where: { id: leaveApplicationId },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    departmentId: true
                }
            }
        }
    });

    if (!leave) {
        throw new Error('Leave application not found');
    }

    // Verify manager's department
    const manager = await prisma.user.findUnique({
        where: { id: managerId },
        select: { departmentId: true }
    });

    if (manager.departmentId !== leave.user.departmentId) {
        throw new Error('You can only approve leaves from your department');
    }

    // Check status
    if (leave.status !== 'PENDING') {
        throw new Error(`Cannot approve leave with status: ${leave.status}`);
    }

    // Use transaction for approval
    const result = await prisma.$transaction(async (tx) => {
        // Re-validate balance
        const balanceInfo = await calculateAvailableBalance(
            leave.userId,
            leave.leaveTypeId,
            leave.year
        );

        if (balanceInfo.available < leave.totalDays) {
            throw new Error(
                `Insufficient balance. Available: ${balanceInfo.available}, Required: ${leave.totalDays}`
            );
        }

        // Update leave application
        const approvedLeave = await tx.leaveApplication.update({
            where: { id: leaveApplicationId },
            data: {
                status: 'APPROVED',
                approvedBy: managerId,
                approvedAt: new Date()
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

        // Update balance
        await tx.leaveBalance.updateMany({
            where: {
                userId: leave.userId,
                leaveTypeId: leave.leaveTypeId,
                year: leave.year
            },
            data: {
                used: {
                    increment: leave.totalDays
                }
            }
        });

        // Create attendance records
        await createLeaveAttendance(leave, tx);

        return approvedLeave;
    });

    return result;
};

/**
 * Reject leave application
 */
const rejectLeave = async (leaveApplicationId, managerId, reason) => {
    // Get leave application
    const leave = await prisma.leaveApplication.findUnique({
        where: { id: leaveApplicationId },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    departmentId: true
                }
            }
        }
    });

    if (!leave) {
        throw new Error('Leave application not found');
    }

    // Verify manager's department
    const manager = await prisma.user.findUnique({
        where: { id: managerId },
        select: { departmentId: true }
    });

    if (manager.departmentId !== leave.user.departmentId) {
        throw new Error('You can only reject leaves from your department');
    }

    // Check status
    if (leave.status !== 'PENDING') {
        throw new Error(`Cannot reject leave with status: ${leave.status}`);
    }

    // Update leave application
    const rejectedLeave = await prisma.leaveApplication.update({
        where: { id: leaveApplicationId },
        data: {
            status: 'REJECTED',
            rejectedBy: managerId,
            rejectedAt: new Date(),
            rejectionReason: reason
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

    return rejectedLeave;
};

/**
 * Get team leave calendar
 */
const getTeamCalendar = async (managerId, startDate, endDate) => {
    // Get manager details
    const manager = await prisma.user.findUnique({
        where: { id: managerId },
        select: { departmentId: true }
    });

    if (!manager) {
        throw new Error('Manager not found');
    }

    // Get all approved leaves in date range for department
    const leaves = await prisma.leaveApplication.findMany({
        where: {
            status: 'APPROVED',
            user: {
                departmentId: manager.departmentId
            },
            OR: [
                {
                    AND: [
                        { startDate: { lte: endDate } },
                        { endDate: { gte: startDate } }
                    ]
                }
            ]
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
        },
        orderBy: {
            startDate: 'asc'
        }
    });

    return leaves;
};

module.exports = {
    getPendingApprovals,
    approveLeave,
    rejectLeave,
    getTeamCalendar
};
