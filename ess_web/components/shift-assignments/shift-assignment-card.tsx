'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Check, X, Trash2 } from 'lucide-react';
import { ShiftAssignment, User as UserType, Shift } from '@/types';
import { formatDate, formatTime } from '@/lib/utils'; // Assuming these exist based on shifts page, or I might need to check/create them.
// Actually, shifts page imported them from '@/lib/utils'. Let's assume they are there.

interface ShiftAssignmentCardProps {
    assignment: ShiftAssignment;
    user?: UserType;
    shift?: Shift;
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    onRemove?: (id: string) => void;
    isPending?: boolean;
}

export function ShiftAssignmentCard({
    assignment,
    user,
    shift,
    onApprove,
    onReject,
    onRemove,
    isPending = false,
}: ShiftAssignmentCardProps) {
    const formatTimeRange = (start?: string, end?: string) => {
        if (!start || !end) return 'Time not set';
        // Simple formatting if utils fail, but assuming formatTime handles ISO strings
        try {
            return `${formatTime(start)} - ${formatTime(end)}`;
        } catch (e) {
            return `${start} - ${end}`;
        }
    };

    return (
        <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                            <User size={16} />
                        </div>
                        <div>
                            <p className="font-medium text-sm text-slate-900">
                                {user?.fullName || 'Unknown User'}
                            </p>
                            <p className="text-xs text-slate-500">
                                {user?.employeeCode || 'No ID'}
                            </p>
                        </div>
                    </div>
                    <Badge variant={isPending ? 'pending' : 'default'} className={isPending ? "bg-yellow-100 text-yellow-800 border-yellow-200" : "bg-blue-100 text-blue-800 border-blue-200"}>
                        {isPending ? 'Pending' : 'Assigned'}
                    </Badge>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Clock size={16} className="text-slate-400" />
                        <span className="font-medium">{shift?.name || 'Unknown Shift'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 ml-6">
                        <span>{formatTimeRange(shift?.startTime, shift?.endTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Calendar size={16} className="text-slate-400" />
                        <span>{formatDate(assignment.date)}</span>
                    </div>
                </div>

                <div className="flex gap-2 mt-2">
                    {isPending ? (
                        <>
                            <Button
                                size="sm"
                                className="flex-1 bg-green-600 hover:bg-green-700 h-8 text-xs"
                                onClick={() => onApprove?.(assignment.id)}
                            >
                                <Check size={14} className="mr-1" />
                                Approve
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                className="flex-1 h-8 text-xs bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                onClick={() => onReject?.(assignment.id)}
                            >
                                <X size={14} className="mr-1" />
                                Reject
                            </Button>
                        </>
                    ) : (
                        <Button
                            size="sm"
                            variant="ghost"
                            className="w-full h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => onRemove?.(assignment.id)}
                        >
                            <Trash2 size={14} className="mr-1" />
                            Remove Assignment
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
