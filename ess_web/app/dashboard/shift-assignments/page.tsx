'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Calendar as CalendarIcon, Filter, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { ShiftAssignment, User, Shift } from '@/types';
import { ShiftAssignmentCard } from '@/components/shift-assignments/shift-assignment-card';
import AssignShiftDialog from '@/components/shift-assignments/assign-shift-dialog';
import RejectDialog from '@/components/shift-assignments/reject-dialog';
import RemoveDialog from '@/components/shift-assignments/remove-dialog';

export default function ShiftAssignmentsPage() {
    // Data State
    const [pendingAssignments, setPendingAssignments] = useState<ShiftAssignment[]>([]);
    const [assignedShifts, setAssignedShifts] = useState<ShiftAssignment[]>([]);
    const [users, setUsers] = useState<Record<string, User>>({});
    const [shifts, setShifts] = useState<Record<string, Shift>>({});
    const [loading, setLoading] = useState(true);

    // Filter State
    const [dateFilter, setDateFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');

    // Modal State
    const [showAssignDialog, setShowAssignDialog] = useState(false);
    const [rejectId, setRejectId] = useState<string | null>(null);
    const [removeId, setRemoveId] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [dateFilter, statusFilter]);

    const loadData = async () => {
        try {
            setLoading(true);

            // Fetch Reference Data (Users & Shifts) if not already loaded
            // Optimization: In a real app we might cache this or use React Query properly
            // Here we fetch every time for simplicity or assume it's fast
            const [usersRes, shiftsRes] = await Promise.all([
                apiClient.getUsers(),
                apiClient.getShifts()
            ]);

            if (usersRes.success) {
                const userMap = (usersRes.data || []).reduce((acc: any, user: User) => {
                    acc[user.id] = user;
                    return acc;
                }, {});
                setUsers(userMap);
            }

            if (shiftsRes.success) {
                const shiftMap = (shiftsRes.data || []).reduce((acc: any, shift: Shift) => {
                    acc[shift.id] = shift;
                    return acc;
                }, {});
                setShifts(shiftMap);
            }

            // Fetch Assignments
            // Strategy: Fetch Pending separately if no filter, or all together based on filter
            // To match requirements: 
            // - Pending section (always PENDING)
            // - Assigned section (APPROVED or by filter)

            let pendingReq;
            let approvedReq;

            if (statusFilter === 'ALL' || statusFilter === 'PENDING') {
                pendingReq = apiClient.getShiftAssignments('PENDING', dateFilter);
            }

            if (statusFilter === 'ALL' || statusFilter === 'APPROVED') {
                approvedReq = apiClient.getShiftAssignments('APPROVED', dateFilter);
            }

            const [pendingRes, approvedRes] = await Promise.all([
                pendingReq,
                approvedReq
            ]);

            if (pendingRes?.success) setPendingAssignments(pendingRes.data || []);
            else if (!pendingReq) setPendingAssignments([]); // Clear if filtered out

            if (approvedRes?.success) setAssignedShifts(approvedRes.data || []);
            else if (!approvedReq) setAssignedShifts([]); // Clear if filtered out

        } catch (error) {
            console.error('Failed to load assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await apiClient.approveShiftAssignment(id);
            // Optimistic update or reload
            loadData();
        } catch (error) {
            console.error('Failed to approve:', error);
            alert('Failed to approve assignment');
        }
    };

    return (
        <div className="space-y-8 p-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-900">
                        <Layers className="w-8 h-8 text-indigo-600" />
                        Shift Assignment
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Assign and manage employee shifts with approval workflow
                    </p>
                </div>
                <Button
                    onClick={() => setShowAssignDialog(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 shadow-lg text-white"
                >
                    Assign New Shift
                </Button>
            </div>

            {/* Filters */}
            <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full md:w-48">
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Filter by Status</label>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending Only</option>
                            <option value="APPROVED">Approved Only</option>
                        </Select>
                    </div>
                    <div className="w-full md:w-48">
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Filter by Date</label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                type="date"
                                className="pl-9"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1"></div>
                    {/* Clear Filters Button could go here */}
                    {(dateFilter || statusFilter !== 'ALL') && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setDateFilter(''); setStatusFilter('ALL'); }}
                            className="text-slate-500"
                        >
                            Clear Filters
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Pending Approvals Section */}
            {(statusFilter === 'ALL' || statusFilter === 'PENDING') && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-yellow-100 p-1.5 rounded-full">
                            <AlertCircle className="w-4 h-4 text-yellow-700" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">
                            Pending Approval
                            <span className="ml-2 text-sm font-normal text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                {pendingAssignments.length}
                            </span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-lg border border-slate-200"></div>
                            ))}
                        </div>
                    ) : pendingAssignments.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                            <p className="text-slate-500">No pending approvals</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {pendingAssignments.map(assignment => (
                                <ShiftAssignmentCard
                                    key={assignment.id}
                                    assignment={assignment}
                                    user={users[assignment.userId]}
                                    shift={shifts[assignment.shiftId]}
                                    isPending={true}
                                    onApprove={handleApprove}
                                    onReject={(id) => setRejectId(id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Assigned Shifts Section */}
            {(statusFilter === 'ALL' || statusFilter === 'APPROVED') && (
                <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                        <div className="bg-green-100 p-1.5 rounded-full">
                            <CheckCircle2 className="w-4 h-4 text-green-700" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">
                            Assigned Shifts
                            <span className="ml-2 text-sm font-normal text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                {assignedShifts.length}
                            </span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-40 bg-slate-100 animate-pulse rounded-lg border border-slate-200"></div>
                            ))}
                        </div>
                    ) : assignedShifts.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                            <p className="text-slate-500">No assigned shifts found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {assignedShifts.map(assignment => (
                                <ShiftAssignmentCard
                                    key={assignment.id}
                                    assignment={assignment}
                                    user={users[assignment.userId]}
                                    shift={shifts[assignment.shiftId]}
                                    onRemove={(id) => setRemoveId(id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Dialogs */}
            <AssignShiftDialog
                open={showAssignDialog}
                onClose={() => setShowAssignDialog(false)}
                onSuccess={() => {
                    setShowAssignDialog(false);
                    loadData();
                }}
            />

            <RejectDialog
                open={!!rejectId}
                assignmentId={rejectId}
                onClose={() => setRejectId(null)}
                onSuccess={() => {
                    setRejectId(null);
                    loadData();
                }}
            />

            <RemoveDialog
                open={!!removeId}
                assignmentId={removeId}
                onClose={() => setRemoveId(null)}
                onSuccess={() => {
                    setRemoveId(null);
                    loadData();
                }}
            />
        </div>
    );
}
