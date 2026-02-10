'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, Check, X, User } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { LeaveRequest } from '@/types';
import { formatDate } from '@/lib/utils';
import RejectLeaveDialog from '@/components/leave-approvals/reject-leave-dialog';

export default function LeaveApprovalsPage() {
    const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);
    const [showRejectDialog, setShowRejectDialog] = useState(false);

    useEffect(() => {
        loadPendingLeaves();
    }, []);

    const loadPendingLeaves = async () => {
        try {
            setLoading(true);
            const response = await apiClient.getPendingLeaveApprovals();
            if (response.success) {
                setPendingLeaves(response.data || []);
            }
        } catch (error) {
            console.error('Failed to load pending leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        if (!confirm('Are you sure you want to approve this leave request?')) return;

        try {
            const response = await apiClient.approveLeave(id);
            if (response.success) {
                loadPendingLeaves();
            }
        } catch (error) {
            console.error('Failed to approve leave:', error);
        }
    };

    const handleRejectClick = (id: string) => {
        setSelectedLeaveId(id);
        setShowRejectDialog(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        Leave Approvals
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Review and manage pending leave requests
                    </p>
                </div>
            </div>

            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Pending Requests</CardTitle>
                    <CardDescription>Leaves waiting for your approval</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : pendingLeaves.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">All caught up!</h3>
                            <p className="text-slate-500">No pending leave requests to review.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Leave Type</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Days</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Applied On</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingLeaves.map((leave) => (
                                    <TableRow key={leave.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs">
                                                    {leave.user.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{leave.user.fullName}</div>
                                                    <div className="text-xs text-slate-500">{leave.user.employeeCode}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-slate-50 font-normal">
                                                {leave.leaveType.name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            <div className="flex flex-col">
                                                <span>{formatDate(leave.startDate)}</span>
                                                <span className="text-slate-400 text-xs">to {formatDate(leave.endDate)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-slate-700">{leave.totalDays}</span>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate" title={leave.reason}>
                                            <span className="text-slate-600 text-sm">{leave.reason}</span>
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-sm">
                                            {formatDate(leave.appliedAt)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0"
                                                    onClick={() => handleApprove(leave.id)}
                                                    title="Approve"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => handleRejectClick(leave.id)}
                                                    title="Reject"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <RejectLeaveDialog
                open={showRejectDialog}
                leaveId={selectedLeaveId}
                onClose={() => setShowRejectDialog(false)}
                onSuccess={() => {
                    setShowRejectDialog(false);
                    loadPendingLeaves();
                }}
            />
        </div>
    );
}
